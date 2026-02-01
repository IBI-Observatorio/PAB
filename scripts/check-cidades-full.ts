import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCidades() {
  const cidades = ['Arujá', 'Piquete', 'Lavrinhas', 'Cruzeiro'];

  for (const nome of cidades) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`CIDADE: ${nome}`);
    console.log('='.repeat(60));

    const cidade = await prisma.cidade.findFirst({
      where: { nome: { contains: nome, mode: 'insensitive' } }
    });

    if (cidade) {
      console.log('\n--- DADOS DA CIDADE ---');
      console.log('ID:', cidade.id);
      console.log('Nome:', cidade.nome);
      console.log('Gentílico:', cidade.gentilico);
      console.log('Data Fundação:', cidade.dataFundacao);
      console.log('Data Aniversário:', cidade.dataAniversario);
      console.log('Padroeiro:', cidade.padroeiro);
      console.log('Prato Típico:', cidade.pratoTipico);
      console.log('Histórico:', cidade.breveHistorico?.substring(0, 100) + '...');

      // Lideranças
      const liderancas = await prisma.lideranca.findMany({
        where: { cidadeId: cidade.id }
      });
      console.log('\n--- LIDERANÇAS ---');
      if (liderancas.length === 0) {
        console.log('Nenhuma liderança cadastrada');
      } else {
        liderancas.forEach(l => {
          console.log(`- ${l.nomeLideranca} (${l.cargo} - ${l.partido})`);
        });
      }
    } else {
      console.log('CIDADE NÃO ENCONTRADA NO BANCO!');
    }
  }
}

checkCidades()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
