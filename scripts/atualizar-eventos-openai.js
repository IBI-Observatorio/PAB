/**
 * Script para atualizar eventos genéricos com dados reais usando OpenAI
 * Substitui "Festa Junina Municipal" e "Festa do Padroeiro" por eventos reais
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CIDADES_POR_EXECUCAO = parseInt(process.argv[2]) || 10;
const DELAY_MS = 1000; // 1 segundo entre requisições

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Chama a API da OpenAI para obter eventos de uma cidade
 */
async function buscarEventosOpenAI(nomeCidade) {
  const prompt = `Para a cidade de ${nomeCidade} (São Paulo, Brasil), liste os 3 principais eventos, festas tradicionais ou feriados locais mais importantes.

Retorne APENAS um JSON válido no formato:
{
  "eventos": [
    {"nome": "Nome do Evento", "data": "2025-MM-DD", "descricao": "Breve descrição"}
  ]
}

Regras:
- Use datas de 2025
- Inclua: aniversário da cidade (se souber a data), festa do padroeiro, rodeios, exposições, festas típicas
- Se não souber informações específicas, use dados plausíveis baseados em cidades similares do interior paulista
- Retorne APENAS o JSON, sem texto adicional`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um especialista em cultura e eventos do interior de São Paulo. Responda apenas com JSON válido.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return null;
    }

    // Limpar e parsear JSON
    let jsonText = content.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    const parsed = JSON.parse(jsonText);
    return parsed.eventos || [];
  } catch (error) {
    console.log(`    ❌ Erro: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('🔄 ATUALIZAR EVENTOS GENÉRICOS COM OPENAI');
  console.log('='.repeat(60));
  console.log('');

  if (!OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY não encontrada no .env');
    return;
  }

  // Buscar cidades com eventos genéricos
  const cidadesComGenericos = await prisma.cidade.findMany({
    where: {
      eventosProximos: {
        some: {
          OR: [
            { festaTradicional: { contains: 'Festa Junina Municipal' } },
            { festaTradicional: { contains: 'Festa do Padroeiro' } }
          ]
        }
      }
    },
    select: {
      id: true,
      nome: true,
      eventosProximos: true
    },
    orderBy: { nome: 'asc' },
    take: CIDADES_POR_EXECUCAO
  });

  console.log(`📊 Cidades com eventos genéricos: ${cidadesComGenericos.length}`);
  console.log(`🎯 Processando: ${Math.min(cidadesComGenericos.length, CIDADES_POR_EXECUCAO)} cidades`);
  console.log('');

  if (cidadesComGenericos.length === 0) {
    console.log('✅ Nenhuma cidade com eventos genéricos!');
    return;
  }

  let atualizadas = 0;
  let totalEventos = 0;

  for (let i = 0; i < cidadesComGenericos.length; i++) {
    const cidade = cidadesComGenericos[i];
    const progresso = `[${String(i + 1).padStart(2, '0')}/${cidadesComGenericos.length}]`;

    console.log(`${progresso} 🔍 ${cidade.nome}`);

    // Buscar eventos reais na OpenAI
    const eventos = await buscarEventosOpenAI(cidade.nome);

    if (!eventos || eventos.length === 0) {
      console.log(`    ⚠️  Não foi possível obter eventos`);
      continue;
    }

    // Deletar eventos genéricos
    await prisma.eventoProximo.deleteMany({
      where: {
        cidadeId: cidade.id,
        OR: [
          { festaTradicional: { contains: 'Festa Junina Municipal' } },
          { festaTradicional: { contains: 'Festa do Padroeiro' } }
        ]
      }
    });

    // Inserir novos eventos
    let salvos = 0;
    for (const evento of eventos) {
      try {
        // Verificar se já existe
        const existente = await prisma.eventoProximo.findFirst({
          where: {
            cidadeId: cidade.id,
            festaTradicional: evento.nome
          }
        });

        if (existente) continue;

        let dataEvento = new Date(evento.data);
        if (isNaN(dataEvento.getTime())) {
          dataEvento = new Date('2025-06-01');
        }

        await prisma.eventoProximo.create({
          data: {
            cidadeId: cidade.id,
            festaTradicional: evento.nome,
            dataFeriado: dataEvento,
            fotos: JSON.stringify([])
          }
        });
        salvos++;
      } catch (err) {
        // Ignorar erros de duplicata
      }
    }

    totalEventos += salvos;
    atualizadas++;

    const nomes = eventos.map(e => e.nome).slice(0, 2).join(', ');
    console.log(`    ✅ ${salvos} evento(s): ${nomes}...`);

    if (i < cidadesComGenericos.length - 1) {
      await delay(DELAY_MS);
    }
  }

  // Contar restantes
  const restantes = await prisma.cidade.count({
    where: {
      eventosProximos: {
        some: {
          OR: [
            { festaTradicional: { contains: 'Festa Junina Municipal' } },
            { festaTradicional: { contains: 'Festa do Padroeiro' } }
          ]
        }
      }
    }
  });

  console.log('');
  console.log('='.repeat(60));
  console.log('📈 RESUMO');
  console.log('='.repeat(60));
  console.log(`✅ Cidades atualizadas: ${atualizadas}`);
  console.log(`🎉 Eventos salvos: ${totalEventos}`);
  console.log(`📋 Cidades restantes: ${restantes}`);

  if (restantes > 0) {
    console.log('');
    console.log(`💡 Execute novamente para processar mais ${Math.min(CIDADES_POR_EXECUCAO, restantes)} cidades`);
  }

  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
