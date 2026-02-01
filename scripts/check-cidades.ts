import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCidades() {
  const cidades = ['Arujá', 'Piquete', 'Lavrinhas', 'Cruzeiro'];

  for (const nome of cidades) {
    console.log(`\n=== ${nome} ===`);
    const cidade = await prisma.cidade.findFirst({
      where: { nome: { contains: nome, mode: 'insensitive' } },
      include: {
        liderancas: true,
        dadosDemograficos: true,
        emendas: true
      }
    });

    if (cidade) {
      console.log('ID:', cidade.id);
      console.log('Nome:', cidade.nome);
      console.log('Gentílico:', cidade.gentilico);
      console.log('Lideranças:', cidade.liderancas.length);
      console.log('Dados Demográficos:', cidade.dadosDemograficos ? 'Sim' : 'Não');
      console.log('Emendas:', cidade.emendas.length);
    } else {
      console.log('CIDADE NÃO ENCONTRADA!');
    }
  }
}

checkCidades()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
