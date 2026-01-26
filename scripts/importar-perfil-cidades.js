const { PrismaClient } = require('@prisma/client');
const { dadosCidades } = require('./dados-cidades');

const prisma = new PrismaClient();

function normalizeNome(nome) {
  // Normaliza o nome para comparação (remove acentos e converte para maiúsculas)
  return nome
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function findCidadeData(nomeCidade) {
  const nomeNormalizado = normalizeNome(nomeCidade);

  for (const [nome, dados] of Object.entries(dadosCidades)) {
    if (normalizeNome(nome) === nomeNormalizado) {
      return dados;
    }
  }
  return null;
}

async function main() {
  console.log('🚀 Iniciando importação de perfil das cidades\n');
  console.log('='.repeat(60));

  // Buscar todas as cidades do banco
  const cidades = await prisma.cidade.findMany({
    orderBy: { nome: 'asc' }
  });

  console.log(`📍 Total de cidades no banco: ${cidades.length}`);
  console.log(`📊 Total de cidades com dados: ${Object.keys(dadosCidades).length}\n`);

  let atualizadas = 0;
  let naoEncontradas = 0;
  const cidadesNaoEncontradas = [];

  for (const cidade of cidades) {
    const dados = findCidadeData(cidade.nome);

    if (dados) {
      try {
        // Processar data de fundação
        let dataFundacao = new Date('1900-01-01');
        if (dados.dataFundacao) {
          dataFundacao = new Date(dados.dataFundacao);
          if (isNaN(dataFundacao.getTime())) {
            dataFundacao = new Date('1900-01-01');
          }
        }

        // Processar data de aniversário (usar ano 2025)
        let dataAniversario = new Date('2025-01-01');
        if (dados.dataAniversario) {
          const [mes, dia] = dados.dataAniversario.split('-');
          if (mes && dia) {
            dataAniversario = new Date(`2025-${mes}-${dia}`);
            if (isNaN(dataAniversario.getTime())) {
              // Se falhar, usar mesma data da fundação com ano 2025
              dataAniversario = new Date(`2025-${(dataFundacao.getMonth() + 1).toString().padStart(2, '0')}-${dataFundacao.getDate().toString().padStart(2, '0')}`);
            }
          }
        }

        await prisma.cidade.update({
          where: { id: cidade.id },
          data: {
            gentilico: dados.gentilico,
            dataFundacao: dataFundacao,
            dataAniversario: dataAniversario,
            breveHistorico: dados.breveHistorico,
            padroeiro: dados.padroeiro,
            pratoTipico: dados.pratoTipico
          }
        });

        console.log(`✅ ${cidade.nome} - ${dados.gentilico}`);
        atualizadas++;
      } catch (error) {
        console.log(`❌ ${cidade.nome} - Erro: ${error.message}`);
      }
    } else {
      console.log(`⚠️  ${cidade.nome} - Dados não encontrados`);
      cidadesNaoEncontradas.push(cidade.nome);
      naoEncontradas++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 RESUMO FINAL:');
  console.log(`   ✅ Atualizadas: ${atualizadas} cidades`);
  console.log(`   ⚠️  Não encontradas: ${naoEncontradas} cidades`);
  console.log(`   📍 Total: ${cidades.length} cidades\n`);

  if (cidadesNaoEncontradas.length > 0) {
    console.log('📋 Cidades sem dados:');
    cidadesNaoEncontradas.forEach(nome => console.log(`   - ${nome}`));
  }

  if (atualizadas === cidades.length) {
    console.log('\n🎉 Todas as cidades foram atualizadas com sucesso!');
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
