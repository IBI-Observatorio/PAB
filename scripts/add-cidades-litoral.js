const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Adicionando cidades do litoral paulista...\n');

  const cidades = [
    {
      nome: 'Santos',
      gentilico: 'Santista',
      dataFundacao: new Date('1546-01-26'),
      dataAniversario: new Date('2025-01-26'),
      breveHistorico: 'Santos é uma cidade portuária fundada em 1546. Possui o maior porto da América Latina e foi fundamental para o ciclo do café no Brasil. A cidade é conhecida por suas praias, pelo time Santos FC e por ter sido lar de Pelé.',
      padroeiro: 'Nossa Senhora do Monte Serrat',
      pratoTipico: 'Bolinho de Bacalhau',
      fotoPerfil: null,
      fotoBackground: null,
      dadosDemograficos: {
        percentualRural: 0.5,
        percentualUrbano: 99.5,
        percentualCatolico: 52.0,
        percentualEspirita: 5.2,
        percentualEvangelico: 25.3,
        percentualSemReligiao: 17.5,
        religiaoPredominante: 'Católico',
        idh: 0.840,
        taxaAlfabetizacao: 97.5,
        principaisBairros: JSON.stringify([
          'Gonzaga',
          'Boqueirão',
          'Ponta da Praia',
          'Embaré',
          'Aparecida',
          'Vila Mathias',
          'Marapé',
          'Campo Grande'
        ])
      },
      dadosVotacao: {
        votosPauloAlexandre2022: 8500,
        votosOutrosDeputadosFederais2022: 180000,
        votosPSDBTotal2022: 42000,
        votosPSDTotal2022: 35000,
        votosOutrosPartidos2022: 250000,
        votosPresidente2022: JSON.stringify({
          'Luiz Inácio Lula da Silva': 125000,
          'Jair Bolsonaro': 148000
        }),
        votosGovernador2022: JSON.stringify({
          'Tarcísio de Freitas': 155000,
          'Fernando Haddad': 120000
        }),
        pesquisasEleitorais: null,
        votosLegendaPSDB45: 12000,
        votosLegendaPSD55: 9500
      }
    },
    {
      nome: 'Cubatão',
      gentilico: 'Cubatense',
      dataFundacao: new Date('1949-12-24'),
      dataAniversario: new Date('2025-12-24'),
      breveHistorico: 'Cubatão foi emancipada em 1949 e se tornou um importante polo industrial. Conhecida como "Vale da Morte" nos anos 80 devido à poluição, a cidade se reinventou e hoje é referência mundial em recuperação ambiental.',
      padroeiro: 'São José',
      pratoTipico: 'Afogado Cubatense',
      fotoPerfil: null,
      fotoBackground: null,
      dadosDemograficos: {
        percentualRural: 8.0,
        percentualUrbano: 92.0,
        percentualCatolico: 48.5,
        percentualEspirita: 2.8,
        percentualEvangelico: 32.1,
        percentualSemReligiao: 16.6,
        religiaoPredominante: 'Católico',
        idh: 0.737,
        taxaAlfabetizacao: 94.8,
        principaisBairros: JSON.stringify([
          'Centro',
          'Vila Nova',
          'Jardim Casqueiro',
          'Vila Natal',
          'Parque Fernando Jorge',
          'Jardim das Indústrias'
        ])
      },
      dadosVotacao: {
        votosPauloAlexandre2022: 2800,
        votosOutrosDeputadosFederais2022: 52000,
        votosPSDBTotal2022: 11500,
        votosPSDTotal2022: 9200,
        votosOutrosPartidos2022: 75000,
        votosPresidente2022: JSON.stringify({
          'Luiz Inácio Lula da Silva': 42000,
          'Jair Bolsonaro': 38000
        }),
        votosGovernador2022: JSON.stringify({
          'Tarcísio de Freitas': 40000,
          'Fernando Haddad': 39000
        }),
        pesquisasEleitorais: null,
        votosLegendaPSDB45: 3200,
        votosLegendaPSD55: 2800
      }
    },
    {
      nome: 'São Vicente',
      gentilico: 'Vicentino',
      dataFundacao: new Date('1532-01-22'),
      dataAniversario: new Date('2025-01-22'),
      breveHistorico: 'São Vicente é a primeira vila fundada no Brasil, em 1532 por Martim Afonso de Sousa. Conhecida como "Cellula Mater da Nacionalidade", é um marco histórico da colonização portuguesa. A cidade possui belas praias e rica história.',
      padroeiro: 'São Vicente Mártir',
      pratoTipico: 'Caldeirada de Frutos do Mar',
      fotoPerfil: null,
      fotoBackground: null,
      dadosDemograficos: {
        percentualRural: 1.2,
        percentualUrbano: 98.8,
        percentualCatolico: 50.5,
        percentualEspirita: 3.9,
        percentualEvangelico: 28.4,
        percentualSemReligiao: 17.2,
        religiaoPredominante: 'Católico',
        idh: 0.768,
        taxaAlfabetizacao: 95.6,
        principaisBairros: JSON.stringify([
          'Centro',
          'Itararé',
          'Gonzaguinha',
          'Cidade Náutica',
          'Vila Margarida',
          'Parque Bitaru',
          'Japuí'
        ])
      },
      dadosVotacao: {
        votosPauloAlexandre2022: 5200,
        votosOutrosDeputadosFederais2022: 155000,
        votosPSDBTotal2022: 32000,
        votosPSDTotal2022: 28000,
        votosOutrosPartidos2022: 210000,
        votosPresidente2022: JSON.stringify({
          'Luiz Inácio Lula da Silva': 118000,
          'Jair Bolsonaro': 105000
        }),
        votosGovernador2022: JSON.stringify({
          'Tarcísio de Freitas': 112000,
          'Fernando Haddad': 110000
        }),
        pesquisasEleitorais: null,
        votosLegendaPSDB45: 8500,
        votosLegendaPSD55: 7200
      }
    }
  ];

  for (const cidadeData of cidades) {
    const { dadosDemograficos, dadosVotacao, ...cidadeInfo } = cidadeData;

    // Verificar se a cidade já existe
    const existente = await prisma.cidade.findFirst({
      where: { nome: cidadeInfo.nome }
    });

    if (existente) {
      console.log(`Cidade ${cidadeInfo.nome} já existe (ID: ${existente.id}), pulando...`);
      continue;
    }

    // Criar cidade
    const cidade = await prisma.cidade.create({
      data: cidadeInfo
    });
    console.log(`✓ Cidade criada: ${cidade.nome} (ID: ${cidade.id})`);

    // Criar dados demográficos
    await prisma.dadosDemograficos.create({
      data: {
        cidadeId: cidade.id,
        ...dadosDemograficos
      }
    });
    console.log(`  ✓ Dados demográficos criados`);

    // Criar dados de votação
    await prisma.dadosVotacao.create({
      data: {
        cidadeId: cidade.id,
        ...dadosVotacao
      }
    });
    console.log(`  ✓ Dados de votação criados\n`);
  }

  console.log('Concluído! Listando todas as cidades:');
  const todasCidades = await prisma.cidade.findMany({
    select: { id: true, nome: true }
  });
  todasCidades.forEach(c => console.log(`  - ID ${c.id}: ${c.nome}`));
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
