import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkVotacao() {
  const cidadesSemVotacao = await prisma.cidade.findMany({
    where: {
      dadosVotacao: null
    },
    select: {
      id: true,
      nome: true
    },
    orderBy: { nome: 'asc' }
  });

  console.log(`\n=== CIDADES SEM DADOS DE VOTAÇÃO: ${cidadesSemVotacao.length} ===\n`);
  cidadesSemVotacao.forEach(c => console.log(`ID ${c.id}: ${c.nome}`));

  const cidadesComVotacao = await prisma.cidade.findMany({
    where: {
      dadosVotacao: { isNot: null }
    },
    select: {
      id: true,
      nome: true
    }
  });

  console.log(`\n=== CIDADES COM DADOS DE VOTAÇÃO: ${cidadesComVotacao.length} ===\n`);
}

checkVotacao()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
