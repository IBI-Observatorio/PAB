const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.deputadoFederal.count();
    console.log('Total de deputados no banco:', count);

    if (count > 0) {
      const sample = await prisma.deputadoFederal.findMany({
        take: 5,
        orderBy: { votos2022: 'desc' },
        include: { cidade: true }
      });

      console.log('\nExemplos (Top 5 por votos):');
      sample.forEach(dep => {
        console.log(`- ${dep.nomeUrna} (${dep.partido}) - ${dep.votos2022.toLocaleString()} votos em ${dep.cidade.nome}`);
      });
    }
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
