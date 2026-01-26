const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
require('dotenv').config();

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Delay entre requisições para não sobrecarregar a API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function pesquisarDadosCidade(nomeCidade) {
  const prompt = `Pesquise informações sobre a cidade de ${nomeCidade}, São Paulo, Brasil e retorne APENAS um JSON válido (sem markdown, sem explicações) com a seguinte estrutura:

{
  "gentilico": "como são chamados os habitantes (ex: paulistano, santista)",
  "dataFundacao": "data de fundação no formato YYYY-MM-DD (se só tiver o ano, use 01-01)",
  "dataAniversario": "dia e mês do aniversário no formato MM-DD",
  "breveHistorico": "um parágrafo de 2-4 frases sobre a história e origem da cidade, principais características e fatos marcantes (máximo 500 caracteres)",
  "padroeiro": "nome do padroeiro ou padroeira da cidade",
  "pratoTipico": "prato típico ou produto tradicional mais famoso da cidade"
}

IMPORTANTE:
- Retorne APENAS o JSON, sem nenhum texto antes ou depois
- Se não encontrar alguma informação, coloque "Não disponível"
- O histórico deve ser conciso e informativo
- Para dataFundacao use o ano de fundação/emancipação da cidade`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em dados municipais brasileiros. Sempre responda apenas com JSON válido, sem markdown ou explicações adicionais.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800
    });

    const content = response.choices[0].message.content.trim();

    // Tentar extrair JSON mesmo se vier com markdown
    let jsonStr = content;
    if (content.includes('```')) {
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        jsonStr = match[1].trim();
      }
    }

    const dados = JSON.parse(jsonStr);
    return dados;
  } catch (error) {
    console.error(`  ❌ Erro ao pesquisar ${nomeCidade}:`, error.message);
    return null;
  }
}

async function atualizarCidade(cidade, dados) {
  try {
    // Processar data de fundação
    let dataFundacao = new Date('1900-01-01');
    if (dados.dataFundacao && dados.dataFundacao !== 'Não disponível') {
      try {
        dataFundacao = new Date(dados.dataFundacao);
        if (isNaN(dataFundacao.getTime())) {
          dataFundacao = new Date('1900-01-01');
        }
      } catch {
        dataFundacao = new Date('1900-01-01');
      }
    }

    // Processar data de aniversário (usar ano 2025 como referência)
    let dataAniversario = new Date('2025-01-01');
    if (dados.dataAniversario && dados.dataAniversario !== 'Não disponível') {
      try {
        // Formato esperado: MM-DD
        const [mes, dia] = dados.dataAniversario.split('-');
        if (mes && dia) {
          dataAniversario = new Date(`2025-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`);
        }
        if (isNaN(dataAniversario.getTime())) {
          // Se falhou, tentar usar a data de fundação
          dataAniversario = new Date(`2025-${(dataFundacao.getMonth() + 1).toString().padStart(2, '0')}-${dataFundacao.getDate().toString().padStart(2, '0')}`);
        }
      } catch {
        dataAniversario = new Date('2025-01-01');
      }
    }

    await prisma.cidade.update({
      where: { id: cidade.id },
      data: {
        gentilico: dados.gentilico || cidade.gentilico,
        dataFundacao: dataFundacao,
        dataAniversario: dataAniversario,
        breveHistorico: dados.breveHistorico || cidade.breveHistorico,
        padroeiro: dados.padroeiro || cidade.padroeiro,
        pratoTipico: dados.pratoTipico || cidade.pratoTipico
      }
    });

    return true;
  } catch (error) {
    console.error(`  ❌ Erro ao atualizar ${cidade.nome}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Iniciando pesquisa e atualização de perfil das cidades\n');
  console.log('=' .repeat(60));

  // Buscar todas as cidades
  const cidades = await prisma.cidade.findMany({
    orderBy: { nome: 'asc' }
  });

  console.log(`📍 Total de cidades: ${cidades.length}\n`);

  let sucesso = 0;
  let falha = 0;

  for (let i = 0; i < cidades.length; i++) {
    const cidade = cidades[i];
    const progresso = `[${(i + 1).toString().padStart(2, '0')}/${cidades.length}]`;

    console.log(`${progresso} 🔍 Pesquisando: ${cidade.nome}...`);

    // Pesquisar dados
    const dados = await pesquisarDadosCidade(cidade.nome);

    if (dados) {
      // Atualizar no banco
      const atualizado = await atualizarCidade(cidade, dados);

      if (atualizado) {
        console.log(`${progresso} ✅ ${cidade.nome} - ${dados.gentilico || 'N/A'}`);
        console.log(`         📅 Fundação: ${dados.dataFundacao || 'N/A'} | 🙏 ${dados.padroeiro || 'N/A'}`);
        console.log(`         🍽️  ${dados.pratoTipico || 'N/A'}`);
        sucesso++;
      } else {
        falha++;
      }
    } else {
      console.log(`${progresso} ⚠️  ${cidade.nome} - Falha na pesquisa`);
      falha++;
    }

    console.log('');

    // Delay entre requisições (1.5 segundos)
    if (i < cidades.length - 1) {
      await delay(1500);
    }
  }

  console.log('=' .repeat(60));
  console.log('\n📊 RESUMO FINAL:');
  console.log(`   ✅ Sucesso: ${sucesso} cidades`);
  console.log(`   ❌ Falha: ${falha} cidades`);
  console.log(`   📍 Total: ${cidades.length} cidades\n`);

  if (sucesso === cidades.length) {
    console.log('🎉 Todas as cidades foram atualizadas com sucesso!');
  } else {
    console.log('⚠️  Algumas cidades não puderam ser atualizadas.');
  }
}

main()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
