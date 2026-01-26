const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Calculando votos por partido (PSDB e PSD) a partir dos deputados\n');

  // Buscar todas as cidades com deputados
  const cidades = await prisma.cidade.findMany({
    include: {
      deputadosFederais: true,
      dadosVotacao: true
    }
  });

  console.log(`📍 ${cidades.length} cidades encontradas\n`);

  let atualizadas = 0;

  for (const cidade of cidades) {
    // Calcular soma de votos por partido
    let votosPSDB = 0;
    let votosPSD = 0;

    for (const dep of cidade.deputadosFederais) {
      if (dep.partido === 'PSDB') {
        votosPSDB += dep.votos2022;
      }
      if (dep.partido === 'PSD') {
        votosPSD += dep.votos2022;
      }
    }

    // Atualizar ou criar registro de votação
    if (cidade.dadosVotacao) {
      await prisma.dadosVotacao.update({
        where: { cidadeId: cidade.id },
        data: {
          votosPSDBTotal2022: votosPSDB,
          votosPSDTotal2022: votosPSD
        }
      });
    } else {
      await prisma.dadosVotacao.create({
        data: {
          cidadeId: cidade.id,
          votosPauloAlexandre2022: 0,
          votosOutrosDeputadosFederais2022: 0,
          votosPSDBTotal2022: votosPSDB,
          votosPSDTotal2022: votosPSD,
          votosOutrosPartidos2022: 0,
          votosPresidente2022: JSON.stringify({}),
          votosGovernador2022: JSON.stringify({}),
          votosLegendaPSDB45: 0,
          votosLegendaPSD55: 0
        }
      });
    }

    atualizadas++;
  }

  console.log(`✅ ${atualizadas} cidades atualizadas com votos totais por partido\n`);

  // Mostrar exemplos
  console.log('📋 Exemplos:');
  const exemplos = await prisma.cidade.findMany({
    where: { nome: { in: ['Santos', 'Americana', 'Guarulhos', 'Cubatão'] } },
    include: { dadosVotacao: true }
  });

  exemplos.forEach(c => {
    if (c.dadosVotacao) {
      console.log(`\n${c.nome}:`);
      console.log(`  PSDB Total: ${c.dadosVotacao.votosPSDBTotal2022.toLocaleString('pt-BR')} votos`);
      console.log(`  PSD Total: ${c.dadosVotacao.votosPSDTotal2022.toLocaleString('pt-BR')} votos`);
    }
  });

  console.log('\n✨ Concluído!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
