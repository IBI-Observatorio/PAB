const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  // Verificar quais cidades têm dadosVotacao
  const comDados = await prisma.cidade.findMany({
    where: {
      dadosVotacao: {
        isNot: null
      }
    },
    include: {
      dadosVotacao: true
    }
  });

  console.log(`\n✅ Cidades COM dadosVotacao: ${comDados.length}`);
  if (comDados.length > 0) {
    console.log('Cidades:', comDados.map(c => c.nome).join(', '));
  }

  // Total de cidades
  const total = await prisma.cidade.count();
  console.log(`\n📊 Total de cidades: ${total}`);

  await prisma.$disconnect();
}

check();
