const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const totalCount = await prisma.deputadoFederal.count();
    console.log(`📊 Total de deputados no banco: ${totalCount.toLocaleString()}\n`);

    // Contar cidades
    const cidades = await prisma.cidade.count();
    console.log(`🏙️  Total de cidades: ${cidades}\n`);

    // Buscar deputados com mais votos (geral)
    console.log('🔝 Top 10 deputados por votos (todas as cidades):');
    const topGeral = await prisma.deputadoFederal.findMany({
      take: 10,
      orderBy: { votos2022: 'desc' },
      include: { cidade: { select: { nome: true } } }
    });

    topGeral.forEach((dep, idx) => {
      console.log(`${idx + 1}. ${dep.nomeUrna} (${dep.partido}) - ${dep.votos2022.toLocaleString()} votos em ${dep.cidade.nome}`);
    });

    // Verificar uma cidade específica grande (Guarulhos)
    console.log('\n📍 Top 10 em Guarulhos:');
    const cidadeGuarulhos = await prisma.cidade.findFirst({
      where: { nome: { contains: 'Guarulhos' } }
    });

    if (cidadeGuarulhos) {
      const topGuarulhos = await prisma.deputadoFederal.findMany({
        where: { cidadeId: cidadeGuarulhos.id },
        take: 10,
        orderBy: { votos2022: 'desc' },
      });

      topGuarulhos.forEach((dep, idx) => {
        console.log(`${idx + 1}. ${dep.nomeUrna} (${dep.partido}) - ${dep.votos2022.toLocaleString()} votos`);
      });
    }

    // Verificar Paulo Alexandre Barbosa
    console.log('\n🔍 Paulo Alexandre Barbosa:');
    const paulo = await prisma.deputadoFederal.findMany({
      where: {
        OR: [
          { nome: { contains: 'PAULO ALEXANDRE' } },
          { nomeUrna: { contains: 'PAULO ALEXANDRE' } }
        ]
      },
      include: { cidade: { select: { nome: true } } },
      take: 5
    });

    if (paulo.length > 0) {
      paulo.forEach(dep => {
        console.log(`- ${dep.nomeUrna} (${dep.partido}) - ${dep.votos2022.toLocaleString()} votos em ${dep.cidade.nome}`);
      });
    } else {
      console.log('❌ Paulo Alexandre Barbosa não encontrado');
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
