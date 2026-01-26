const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clear() {
  await prisma.deputadoFederal.deleteMany();
  console.log('✅ Todos os deputados foram removidos');
  await prisma.$disconnect();
}

clear();
