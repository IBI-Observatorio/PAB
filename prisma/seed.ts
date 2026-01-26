import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar cidade de exemplo
  const cidade = await prisma.cidade.create({
    data: {
      nome: 'São Paulo',
      gentilico: 'Paulistano',
      dataFundacao: new Date('1554-01-25'),
      dataAniversario: new Date('2024-01-25'),
      breveHistorico: 'São Paulo foi fundada em 25 de janeiro de 1554 por padres jesuítas. Iniciou-se como uma pequena missão jesuíta e cresceu para se tornar a maior cidade do Brasil e uma das maiores metrópoles do mundo. Sua história é marcada pelo ciclo do café, imigração europeia e asiática, e rápida industrialização no século XX.',
      padroeiro: 'São Paulo Apóstolo',
      pratoTipico: 'Virado à Paulista',
      fotoPerfil: null,
      fotoBackground: null,
    },
  });

  console.log('Cidade criada:', cidade.nome);

  // Criar dados demográficos
  const demograficos = await prisma.dadosDemograficos.create({
    data: {
      cidadeId: cidade.id,
      percentualRural: 5.5,
      percentualUrbano: 94.5,
      percentualCatolico: 58.2,
      percentualEspirita: 3.5,
      percentualEvangelico: 22.1,
      percentualSemReligiao: 16.2,
      religiaoPredominante: 'Católico',
      idh: 0.805,
      taxaAlfabetizacao: 96.5,
      principaisBairros: JSON.stringify([
        'Pinheiros',
        'Vila Mariana',
        'Mooca',
        'Santana',
        'Butantã',
        'Ipiranga',
        'Penha',
        'Santo Amaro',
      ]),
    },
  });

  console.log('Dados demográficos criados');

  // Criar eventos
  const evento = await prisma.eventoProximo.create({
    data: {
      cidadeId: cidade.id,
      festaTradicional: 'Aniversário de São Paulo',
      dataFeriado: new Date('2025-01-25'),
      fotos: JSON.stringify([]),
    },
  });

  console.log('Evento criado:', evento.festaTradicional);

  // Criar dados de votação
  const votacao = await prisma.dadosVotacao.create({
    data: {
      cidadeId: cidade.id,
      votosPauloAlexandre2022: 45230,
      votosOutrosDeputadosFederais2022: 1250000,
      votosPSDBTotal2022: 320000,
      votosPSDTotal2022: 280000,
      votosOutrosPartidos2022: 1800000,
      votosPresidente2022: JSON.stringify({
        'Luiz Inácio Lula da Silva': 3200000,
        'Jair Bolsonaro': 2800000,
      }),
      votosGovernador2022: JSON.stringify({
        'Tarcísio de Freitas': 2900000,
        'Fernando Haddad': 3100000,
      }),
      pesquisasEleitorais: null,
      votosLegendaPSDB45: 45000,
      votosLegendaPSD55: 38000,
    },
  });

  console.log('Dados de votação criados');

  // Criar emendas
  const emenda = await prisma.emenda.create({
    data: {
      cidadeId: cidade.id,
      descricao: 'Construção de nova unidade básica de saúde no bairro Jardim São Paulo',
      entidadeBeneficiada: 'Prefeitura Municipal de São Paulo - Secretaria de Saúde',
      valorEmenda: 2500000.00,
      valorEmpenhado: 2500000.00,
    },
  });

  console.log('Emenda criada');

  // Criar liderança
  const lideranca = await prisma.lideranca.create({
    data: {
      cidadeId: cidade.id,
      nome: 'João Silva',
      cargo: 'Vereador',
      partido: 'PSDB',
      historicoComPAB: 'Parceria estabelecida desde 2020, com apoio em diversas iniciativas municipais e estaduais. Atuação conjunta em projetos de infraestrutura e educação.',
      votos2024: 15420,
      votosPrevistos2026: 18500,
      dataVisitaGestor: new Date('2024-03-15'),
    },
  });

  console.log('Liderança criada:', lideranca.nome);

  // Criar pauta
  const pauta = await prisma.pauta.create({
    data: {
      cidadeId: cidade.id,
      dataPublicacao: new Date('2024-11-20'),
      urlFonte: 'https://exemplo.com/noticia',
      titulo: 'Falta de iluminação pública no bairro Jardim Aurora',
      resumoProblema: 'Moradores do bairro Jardim Aurora relatam falta de iluminação pública há mais de 3 meses, causando insegurança e dificultando a circulação noturna.',
      localizacaoEspecifica: 'Jardim Aurora - Ruas sem iluminação',
      categoria: 'Infraestrutura',
      volumeMencoes: 350,
      nivelUrgencia: 4,
      sentimentoPredominante: 'Negativo',
      autoridadeResponsavel: 'Prefeitura Municipal - Secretaria de Obras',
      statusResposta: 'Em análise',
      tempoAtraso: 45,
    },
  });

  console.log('Pauta criada:', pauta.titulo);

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
