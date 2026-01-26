/**
 * Script para popular eventos das cidades usando a API do Gemini
 * Busca festas tradicionais, feriados e eventos culturais para cada cidade
 *
 * Uso: node scripts/popular-eventos-gemini.js [quantidade]
 * Exemplo: node scripts/popular-eventos-gemini.js 5  (processa 5 cidades)
 * Exemplo: node scripts/popular-eventos-gemini.js    (processa 10 cidades por padrão)
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configuração da API do Gemini
const GEMINI_API_KEY = 'AIzaSyBuFuNrTzbsfMTRzlPNFMFBubN4fxxC4dc';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Configurações
const CIDADES_POR_EXECUCAO = parseInt(process.argv[2]) || 5; // Quantidade de cidades por execução
const DELAY_MS = 6000; // 6 segundos entre requisições
const MAX_RETRIES = 5; // Máximo de tentativas por cidade

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Chama a API do Gemini para obter eventos de uma cidade
 */
async function buscarEventosGemini(nomeCidade, tentativa = 1) {
  const prompt = `Você é um especialista em cultura e eventos do interior de São Paulo.

Para a cidade de ${nomeCidade} (São Paulo, Brasil), liste os principais eventos, festas tradicionais e feriados locais.

Retorne APENAS um JSON válido (sem markdown, sem \`\`\`) no seguinte formato:
{
  "eventos": [
    {
      "nome": "Nome do Evento/Festa",
      "data": "YYYY-MM-DD",
      "descricao": "Breve descrição do evento"
    }
  ]
}

Regras:
- Liste de 2 a 5 eventos mais importantes da cidade
- Use o ano de 2025 para as datas
- Se não souber a data exata, use uma data aproximada do mês do evento
- Inclua: aniversário da cidade, festa do padroeiro, festas juninas locais, rodeios, exposições agropecuárias, etc.
- Se não conhecer eventos específicos da cidade, retorne um array vazio: {"eventos": []}
- Retorne APENAS o JSON, nada mais`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        }
      })
    });

    // Se rate limit, esperar e tentar novamente
    if (response.status === 429) {
      if (tentativa < MAX_RETRIES) {
        const waitTime = tentativa * 20000; // 20s, 40s, 60s, 80s, 100s
        console.log(`    ⏳ Rate limit, aguardando ${waitTime/1000}s (tentativa ${tentativa}/${MAX_RETRIES})...`);
        await delay(waitTime);
        return buscarEventosGemini(nomeCidade, tentativa + 1);
      } else {
        console.log(`    ❌ Rate limit persistente após ${MAX_RETRIES} tentativas`);
        return null; // Indica que deve parar
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();

    // Extrair o texto da resposta
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.log(`    ⚠️  Resposta vazia do Gemini`);
      return [];
    }

    // Limpar o texto e fazer parse do JSON
    let jsonText = responseText.trim();
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    try {
      const parsed = JSON.parse(jsonText);
      return parsed.eventos || [];
    } catch (parseError) {
      console.log(`    ⚠️  Erro ao parsear JSON: ${parseError.message}`);
      return [];
    }
  } catch (error) {
    console.log(`    ❌ Erro: ${error.message}`);
    return [];
  }
}

/**
 * Salva os eventos no banco de dados
 */
async function salvarEventos(cidadeId, eventos) {
  let salvos = 0;

  for (const evento of eventos) {
    try {
      // Verificar se o evento já existe
      const existente = await prisma.eventoProximo.findFirst({
        where: {
          cidadeId: cidadeId,
          festaTradicional: evento.nome
        }
      });

      if (existente) {
        continue;
      }

      // Converter a data
      let dataEvento;
      try {
        dataEvento = new Date(evento.data);
        if (isNaN(dataEvento.getTime())) {
          dataEvento = new Date('2025-01-01');
        }
      } catch {
        dataEvento = new Date('2025-01-01');
      }

      await prisma.eventoProximo.create({
        data: {
          cidadeId: cidadeId,
          festaTradicional: evento.nome,
          dataFeriado: dataEvento,
          fotos: JSON.stringify([])
        }
      });

      salvos++;
    } catch (error) {
      console.log(`    ⚠️  Erro ao salvar "${evento.nome}": ${error.message}`);
    }
  }

  return salvos;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🎉 POPULAR EVENTOS DAS CIDADES COM GEMINI');
  console.log('='.repeat(60));
  console.log(`📋 Processando até ${CIDADES_POR_EXECUCAO} cidades por execução`);
  console.log('');

  // Buscar cidades SEM eventos
  const cidades = await prisma.cidade.findMany({
    where: {
      eventosProximos: {
        none: {}
      }
    },
    select: {
      id: true,
      nome: true
    },
    orderBy: { nome: 'asc' },
    take: CIDADES_POR_EXECUCAO
  });

  // Contar total de cidades sem eventos
  const totalSemEventos = await prisma.cidade.count({
    where: {
      eventosProximos: {
        none: {}
      }
    }
  });

  const totalCidades = await prisma.cidade.count();

  console.log(`📊 Cidades sem eventos: ${totalSemEventos} de ${totalCidades}`);
  console.log(`🎯 Processando: ${cidades.length} cidades nesta execução`);
  console.log('');

  if (cidades.length === 0) {
    console.log('✅ Todas as cidades já possuem eventos!');
    return;
  }

  let totalEventos = 0;
  let cidadesProcessadas = 0;

  for (let i = 0; i < cidades.length; i++) {
    const cidade = cidades[i];
    const progresso = `[${String(i + 1).padStart(2, '0')}/${cidades.length}]`;

    console.log(`${progresso} 🔍 ${cidade.nome}`);

    // Buscar eventos no Gemini
    const eventos = await buscarEventosGemini(cidade.nome);

    // Se retornou null, significa rate limit persistente - parar execução
    if (eventos === null) {
      console.log('');
      console.log('⛔ Parando execução devido a rate limit persistente.');
      console.log('   Aguarde alguns minutos e execute novamente.');
      break;
    }

    if (eventos.length === 0) {
      console.log(`    ⚠️  Nenhum evento encontrado`);
    } else {
      // Salvar eventos
      const salvos = await salvarEventos(cidade.id, eventos);
      totalEventos += salvos;
      const nomes = eventos.map(e => e.nome).slice(0, 3).join(', ');
      console.log(`    ✅ ${salvos} evento(s): ${nomes}${eventos.length > 3 ? '...' : ''}`);
    }

    cidadesProcessadas++;

    // Delay entre requisições
    if (i < cidades.length - 1) {
      await delay(DELAY_MS);
    }
  }

  // Recalcular restantes
  const restantes = await prisma.cidade.count({
    where: {
      eventosProximos: {
        none: {}
      }
    }
  });

  console.log('');
  console.log('='.repeat(60));
  console.log('📈 RESUMO');
  console.log('='.repeat(60));
  console.log(`✅ Cidades processadas: ${cidadesProcessadas}`);
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
