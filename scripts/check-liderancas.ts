import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLiderancas() {
  const liderancas = await prisma.lideranca.findMany({
    include: { cidade: { select: { nome: true } } },
    orderBy: { id: 'desc' },
    take: 10
  });

  console.log('\n=== ÚLTIMAS LIDERANÇAS NO BANCO ===\n');

  liderancas.forEach(l => {
    console.log(`ID: ${l.id}`);
    console.log(`Cidade: ${l.cidade.nome}`);
    console.log(`Nome: ${l.nomeLideranca}`);
    console.log(`Cargo: ${l.cargo}`);
    console.log(`Partido: ${l.partido}`);
    console.log(`Gestor: ${l.nomeGestor}`);
    console.log(`Votos 2024: ${l.votos2024}`);
    console.log(`Votos 2026 Previstos: ${l.votosPrevistos2026}`);
    console.log(`Data Visita: ${l.dataVisitaGestor}`);
    console.log(`Histórico: ${l.historicoComPAB.substring(0, 100)}...`);
    console.log('---');
  });
}

checkLiderancas()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
