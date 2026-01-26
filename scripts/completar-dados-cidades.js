const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Dados reais das cidades do interior de São Paulo
const dadosCidades = {
  'Aguaí': {
    gentilico: 'aguaiense',
    dataFundacao: new Date('1891-03-13'),
    dataAniversario: new Date('2025-03-13'),
    breveHistorico: 'Aguaí teve origem no final do século XIX com a expansão cafeeira. O nome deriva do tupi e significa "rio dos aguás" (espécie de palmeira). Foi elevada a município em 1891.',
    padroeiro: 'São José',
    pratoTipico: 'Frango com quiabo'
  },
  'Águas da Prata': {
    gentilico: 'pratense',
    dataFundacao: new Date('1958-12-30'),
    dataAniversario: new Date('2025-12-30'),
    breveHistorico: 'Conhecida como Cidade das Águas, é uma estância hidromineral famosa por suas fontes de águas minerais. O nome refere-se à pureza cristalina de suas águas.',
    padroeiro: 'Nossa Senhora Aparecida',
    pratoTipico: 'Truta grelhada'
  },
  'Águas de Lindoia': {
    gentilico: 'lindoiense',
    dataFundacao: new Date('1941-12-30'),
    dataAniversario: new Date('2025-12-30'),
    breveHistorico: 'Estância hidromineral reconhecida internacionalmente por suas águas minerais. O nome Lindoia vem do tupi e significa "cobra bonita". É um importante polo turístico.',
    padroeiro: 'Nossa Senhora das Dores',
    pratoTipico: 'Trutas'
  },
  'Arapeí': {
    gentilico: 'arapeiense',
    dataFundacao: new Date('1993-01-01'),
    dataAniversario: new Date('2025-01-01'),
    breveHistorico: 'Município jovem, desmembrado de Bananal em 1993. O nome vem do tupi "ara-peí" que significa "vale dos pássaros". Região de forte tradição rural.',
    padroeiro: 'São Benedito',
    pratoTipico: 'Feijão tropeiro'
  },
  'Arujá': {
    gentilico: 'arujaense',
    dataFundacao: new Date('1959-04-18'),
    dataAniversario: new Date('2025-04-18'),
    breveHistorico: 'O nome vem do tupi "arujá" que significa "abundância de frutos". Desenvolveu-se como cidade dormitório da Grande São Paulo, mas mantém áreas verdes preservadas.',
    padroeiro: 'São Sebastião',
    pratoTipico: 'Virado à paulista'
  },
  'Bom Jesus dos Perdões': {
    gentilico: 'perdoense',
    dataFundacao: new Date('1965-04-18'),
    dataAniversario: new Date('2025-04-18'),
    breveHistorico: 'Surgiu como parada de tropeiros no século XIX. O nome refere-se ao santuário de Bom Jesus dos Perdões, importante centro de romarias na região.',
    padroeiro: 'Bom Jesus dos Perdões',
    pratoTipico: 'Afogado de carne seca'
  },
  'Bragança Paulista': {
    gentilico: 'bragantino',
    dataFundacao: new Date('1797-12-15'),
    dataAniversario: new Date('2025-12-15'),
    breveHistorico: 'Fundada em 1797, é uma das cidades mais antigas da região. Foi importante entreposto comercial entre São Paulo e Minas Gerais. Polo industrial e educacional.',
    padroeiro: 'Nossa Senhora da Conceição',
    pratoTipico: 'Linguiça de Bragança'
  },
  'Cabreúva': {
    gentilico: 'cabreuvano',
    dataFundacao: new Date('1859-04-24'),
    dataAniversario: new Date('2025-04-24'),
    breveHistorico: 'O nome vem do tupi "caá-breúva" que significa "folha cheirosa", referindo-se à árvore cabreúva. Rica em cachoeiras e trilhas, é destino de ecoturismo.',
    padroeiro: 'Nossa Senhora da Piedade',
    pratoTipico: 'Frango caipira com polenta'
  },
  'Caçapava': {
    gentilico: 'caçapavano',
    dataFundacao: new Date('1855-04-15'),
    dataAniversario: new Date('2025-04-15'),
    breveHistorico: 'O nome vem do tupi "caá-çapaba" que significa "travessia da mata". Importante centro industrial no Vale do Paraíba, com forte presença aeroespacial.',
    padroeiro: 'São João Batista',
    pratoTipico: 'Afogado'
  },
  'Campos do Jordão': {
    gentilico: 'jordanense',
    dataFundacao: new Date('1874-04-29'),
    dataAniversario: new Date('2025-04-29'),
    breveHistorico: 'Conhecida como a Suíça Brasileira, é a cidade mais alta do Brasil (1.628m). Famosa pelo Festival de Inverno e arquitetura europeia. Estância climática desde 1926.',
    padroeiro: 'Nossa Senhora da Saúde',
    pratoTipico: 'Truta com amêndoas'
  },
  'Cordeirópolis': {
    gentilico: 'cordeiropolense',
    dataFundacao: new Date('1948-12-24'),
    dataAniversario: new Date('2025-12-24'),
    breveHistorico: 'Surgiu com a expansão cafeeira e ferroviária. É conhecida como Capital da Laranja Pera e sede do Centro APTA Citros, importante centro de pesquisa citrícola.',
    padroeiro: 'São Sebastião',
    pratoTipico: 'Doces de laranja'
  },
  'Divinolandia': {
    gentilico: 'divinolandense',
    dataFundacao: new Date('1923-12-30'),
    dataAniversario: new Date('2025-12-30'),
    breveHistorico: 'O nome significa "terra do divino". Região de altitude elevada e clima ameno, conhecida pela produção de café e frutas de clima temperado.',
    padroeiro: 'Divino Espírito Santo',
    pratoTipico: 'Café colonial'
  },
  'Espírito Santo do Pinhal': {
    gentilico: 'pinhalense',
    dataFundacao: new Date('1870-04-27'),
    dataAniversario: new Date('2025-04-27'),
    breveHistorico: 'Fundada por fazendeiros de café no século XIX. O nome refere-se ao padroeiro e aos pinheiros da região. Centro produtor de café de qualidade.',
    padroeiro: 'Espírito Santo',
    pratoTipico: 'Quirera com suã'
  },
  'Guaratinguetá': {
    gentilico: 'guaratinguetaense',
    dataFundacao: new Date('1651-02-13'),
    dataAniversario: new Date('2025-02-13'),
    breveHistorico: 'Uma das cidades mais antigas do Vale do Paraíba, fundada em 1651. Foi importante produtora de café no século XIX. Berço de Frei Galvão, primeiro santo brasileiro.',
    padroeiro: 'Santo Antônio',
    pratoTipico: 'Afogado guaratinguetaense'
  },
  'Igaratá': {
    gentilico: 'igarataense',
    dataFundacao: new Date('1964-04-18'),
    dataAniversario: new Date('2025-04-18'),
    breveHistorico: 'O nome vem do tupi e significa "abundância de canoas". A represa de Igaratá abastece parte da Grande São Paulo. Destino de pesca e turismo náutico.',
    padroeiro: 'Nossa Senhora da Escada',
    pratoTipico: 'Peixe de água doce'
  },
  'Jacareí': {
    gentilico: 'jacareiense',
    dataFundacao: new Date('1653-08-03'),
    dataAniversario: new Date('2025-08-03'),
    breveHistorico: 'Uma das cidades mais antigas do Vale do Paraíba. O nome vem do tupi "jacaré-y" que significa "rio dos jacarés". Importante polo industrial e cultural.',
    padroeiro: 'Nossa Senhora da Conceição',
    pratoTipico: 'Afogado'
  },
  'Jaguariúna': {
    gentilico: 'jaguariunense',
    dataFundacao: new Date('1953-12-30'),
    dataAniversario: new Date('2025-12-30'),
    breveHistorico: 'O nome vem do tupi "jaguar-y-una" que significa "rio escuro das onças". Cidade com forte polo tecnológico e industrial, além do tradicional rodeio.',
    padroeiro: 'Nossa Senhora da Conceição',
    pratoTipico: 'Churrasco de rodeio'
  },
  'Joanópolis': {
    gentilico: 'joanopolitano',
    dataFundacao: new Date('1915-12-19'),
    dataAniversario: new Date('2025-12-19'),
    breveHistorico: 'Localizada na Serra da Mantiqueira, é conhecida pelas belas paisagens e cachoeiras. Destino de ecoturismo e esportes de aventura.',
    padroeiro: 'São João Batista',
    pratoTipico: 'Truta de cativeiro'
  },
  'Jundiaí': {
    gentilico: 'jundiaiense',
    dataFundacao: new Date('1655-12-14'),
    dataAniversario: new Date('2025-12-14'),
    breveHistorico: 'Fundada em 1655, é conhecida como Terra da Uva. Foi importante produtora de vinho e hoje é polo industrial diversificado. Primeira cidade cervejeira do Brasil.',
    padroeiro: 'Nossa Senhora do Desterro',
    pratoTipico: 'Uva e derivados'
  },
  'Lindóia': {
    gentilico: 'lindoiense',
    dataFundacao: new Date('1938-12-30'),
    dataAniversario: new Date('2025-12-30'),
    breveHistorico: 'Estância hidromineral famosa por suas águas minerais. O nome vem do tupi "linda-oya" que significa "cobra bonita". Centro de turismo de saúde.',
    padroeiro: 'São Sebastião',
    pratoTipico: 'Comida caseira mineira'
  },
  'Mairiporã': {
    gentilico: 'mairiporense',
    dataFundacao: new Date('1889-03-04'),
    dataAniversario: new Date('2025-03-04'),
    breveHistorico: 'O nome vem do tupi "mayrá-porã" que significa "cidade bonita". Rica em Mata Atlântica e represas, é área de proteção ambiental na Grande São Paulo.',
    padroeiro: 'Nossa Senhora do Bom Sucesso',
    pratoTipico: 'Peixe assado'
  },
  'Nazaré Paulista': {
    gentilico: 'nazareano',
    dataFundacao: new Date('1850-04-30'),
    dataAniversario: new Date('2025-04-30'),
    breveHistorico: 'Surgiu como pouso de tropeiros. Hoje é conhecida pelas represas e turismo rural. O Sistema Cantareira passa por seu território.',
    padroeiro: 'Nossa Senhora de Nazaré',
    pratoTipico: 'Frango caipira'
  },
  'Poá': {
    gentilico: 'poaense',
    dataFundacao: new Date('1949-01-01'),
    dataAniversario: new Date('2025-01-01'),
    breveHistorico: 'O nome vem do tupi "pó-á" referente a uma planta local. Faz parte da Grande São Paulo e destaca-se pela produção de cogumelos.',
    padroeiro: 'Nossa Senhora da Conceição',
    pratoTipico: 'Pratos com cogumelos'
  },
  'Redenção da Serra': {
    gentilico: 'redencense',
    dataFundacao: new Date('1935-12-30'),
    dataAniversario: new Date('2025-12-30'),
    breveHistorico: 'Localizada na Serra do Mar, região de Mata Atlântica preservada. Economia baseada em agricultura familiar e turismo rural.',
    padroeiro: 'Nossa Senhora da Conceição',
    pratoTipico: 'Comida tropeira'
  },
  'Salesópolis': {
    gentilico: 'salesopolitano',
    dataFundacao: new Date('1857-08-16'),
    dataAniversario: new Date('2025-08-16'),
    breveHistorico: 'Abriga as nascentes do Rio Tietê. O nome homenageia o padre Dom Bosco (João Bosco). Conhecida pelo clima frio e ecoturismo.',
    padroeiro: 'Nossa Senhora Aparecida',
    pratoTipico: 'Truta'
  },
  'Santo Antônio do Jardim': {
    gentilico: 'jardinense',
    dataFundacao: new Date('1924-12-30'),
    dataAniversario: new Date('2025-12-30'),
    breveHistorico: 'Pequeno município cafeeiro na região de Espírito Santo do Pinhal. O nome refere-se a Santo Antônio e às belas áreas verdes da região.',
    padroeiro: 'Santo Antônio',
    pratoTipico: 'Café com quitutes'
  },
  'Santo Antônio do Pinhal': {
    gentilico: 'pinhalense',
    dataFundacao: new Date('1991-01-01'),
    dataAniversario: new Date('2025-01-01'),
    breveHistorico: 'Localizada na Serra da Mantiqueira, é conhecida pelo clima frio e turismo de montanha. Oferece belas vistas do Vale do Paraíba.',
    padroeiro: 'Santo Antônio',
    pratoTipico: 'Fondue'
  },
  'São Bento do Sapucaí': {
    gentilico: 'são-bentense',
    dataFundacao: new Date('1858-04-24'),
    dataAniversario: new Date('2025-04-24'),
    breveHistorico: 'Localizada na Serra da Mantiqueira, é famosa pela Pedra do Baú e esportes de aventura. Berço do compositor Elpídio dos Santos.',
    padroeiro: 'São Bento',
    pratoTipico: 'Pinhão e quentão'
  },
  'São João da Boa Vista': {
    gentilico: 'são-joanense',
    dataFundacao: new Date('1821-06-24'),
    dataAniversario: new Date('2025-06-24'),
    breveHistorico: 'Uma das mais antigas da região, conhecida como Cidade Clima. Polo educacional com várias universidades. Arquitetura histórica preservada.',
    padroeiro: 'São João Batista',
    pratoTipico: 'Arroz com suã'
  },
  'São José do Barreiro': {
    gentilico: 'barreirense',
    dataFundacao: new Date('1859-05-02'),
    dataAniversario: new Date('2025-05-02'),
    breveHistorico: 'Antiga cidade do ciclo do café, preserva casarões coloniais. Porta de entrada para o Parque Nacional da Serra da Bocaina.',
    padroeiro: 'São José',
    pratoTipico: 'Barreado'
  },
  'São José do Rio Pardo': {
    gentilico: 'rio-pardense',
    dataFundacao: new Date('1886-10-30'),
    dataAniversario: new Date('2025-10-30'),
    breveHistorico: 'Conhecida como Berço de Os Sertões, onde Euclides da Cunha escreveu sua obra-prima. Preserva importante acervo euclidiano.',
    padroeiro: 'São José',
    pratoTipico: 'Feijão gordo'
  },
  'São José dos Campos': {
    gentilico: 'joseense',
    dataFundacao: new Date('1767-07-27'),
    dataAniversario: new Date('2025-07-27'),
    breveHistorico: 'Maior cidade do Vale do Paraíba, é polo aeroespacial e tecnológico do Brasil. Sede do INPE, Embraer e importantes centros de pesquisa.',
    padroeiro: 'São José',
    pratoTipico: 'Afogado joseense'
  },
  'São Luís do Paraitinga': {
    gentilico: 'luisense',
    dataFundacao: new Date('1773-08-08'),
    dataAniversario: new Date('2025-08-08'),
    breveHistorico: 'Patrimônio histórico nacional, preserva arquitetura colonial do ciclo do café. Famosa pelo Carnaval de marchinhas e Festa do Divino.',
    padroeiro: 'São Luís de Tolosa',
    pratoTipico: 'Afogado'
  },
  'São Sebastião': {
    gentilico: 'sebastianense',
    dataFundacao: new Date('1636-03-16'),
    dataAniversario: new Date('2025-01-20'),
    breveHistorico: 'Uma das cidades mais antigas do litoral norte paulista. Possui importante porto e belas praias como Maresias e Juquehy.',
    padroeiro: 'São Sebastião',
    pratoTipico: 'Azul marinho'
  },
  'São Sebastião da Grama': {
    gentilico: 'gramense',
    dataFundacao: new Date('1925-12-30'),
    dataAniversario: new Date('2025-12-30'),
    breveHistorico: 'Pequena cidade na região de São João da Boa Vista, conhecida pela produção de café especial e clima ameno da serra.',
    padroeiro: 'São Sebastião',
    pratoTipico: 'Café especial'
  },
  'Tambaú': {
    gentilico: 'tambauense',
    dataFundacao: new Date('1906-07-14'),
    dataAniversario: new Date('2025-07-14'),
    breveHistorico: 'O nome vem do tupi "tamba-ú" que significa "concha comestível". Importante centro cerâmico e do setor coureiro-calçadista.',
    padroeiro: 'Nossa Senhora Aparecida',
    pratoTipico: 'Arroz com linguiça'
  },
  'Taubaté': {
    gentilico: 'taubateano',
    dataFundacao: new Date('1645-12-05'),
    dataAniversario: new Date('2025-12-05'),
    breveHistorico: 'Uma das mais antigas e importantes cidades do Vale do Paraíba. Berço de Monteiro Lobato e do folclore do Sítio do Picapau Amarelo.',
    padroeiro: 'São Francisco das Chagas',
    pratoTipico: 'Afogado taubateano'
  },
  'Tremembé': {
    gentilico: 'tremembeense',
    dataFundacao: new Date('1896-03-09'),
    dataAniversario: new Date('2025-03-09'),
    breveHistorico: 'O nome vem do tupi e refere-se aos índios Tremembé. Cidade do Vale do Paraíba com tradição rural e industrial.',
    padroeiro: 'Nossa Senhora da Conceição',
    pratoTipico: 'Virado à paulista'
  },
  'Várzea Paulista': {
    gentilico: 'varzino',
    dataFundacao: new Date('1965-02-24'),
    dataAniversario: new Date('2025-02-24'),
    breveHistorico: 'Surgiu como vila operária da Companhia Paulista de Estradas de Ferro. Hoje é cidade industrial na região de Jundiaí.',
    padroeiro: 'Nossa Senhora Aparecida',
    pratoTipico: 'Macarronada'
  },
  'Bofete': {
    gentilico: 'bofeense',
    dataFundacao: new Date('1857-03-07'),
    dataAniversario: new Date('2025-03-07'),
    breveHistorico: 'Município paulista localizado na região de Botucatu. Nome de origem indígena, economia baseada em agropecuária.',
    padroeiro: 'São Sebastião',
    pratoTipico: 'Churrasco'
  },
  'Bento De Abreu': {
    gentilico: 'bento-abreuense',
    dataFundacao: new Date('1959-12-31'),
    dataAniversario: new Date('2025-12-31'),
    breveHistorico: 'Pequeno município no noroeste paulista, homenageia o político Bento de Abreu Sampaio Vidal. Economia agrícola.',
    padroeiro: 'São Bento',
    pratoTipico: 'Carne de sol'
  },
  'Pirassununga': {
    gentilico: 'pirassununguense',
    dataFundacao: new Date('1879-04-13'),
    dataAniversario: new Date('2025-04-13'),
    breveHistorico: 'O nome vem do tupi "pirá-sunúnga" que significa "peixe que ronca". Sede da Academia da Força Aérea Brasileira.',
    padroeiro: 'Nossa Senhora das Dores',
    pratoTipico: '51 (cachaça local)'
  }
};

async function completarDadosCidades() {
  try {
    console.log('🔄 Atualizando dados das cidades...\n');

    let atualizadas = 0;
    let erros = 0;

    for (const [nome, dados] of Object.entries(dadosCidades)) {
      try {
        // Buscar cidade no banco (pode ter variações no nome)
        const cidade = await prisma.cidade.findFirst({
          where: {
            OR: [
              { nome: nome },
              { nome: { contains: nome.split(' ')[0] } }
            ]
          }
        });

        if (cidade) {
          await prisma.cidade.update({
            where: { id: cidade.id },
            data: {
              gentilico: dados.gentilico,
              dataFundacao: dados.dataFundacao,
              dataAniversario: dados.dataAniversario,
              breveHistorico: dados.breveHistorico,
              padroeiro: dados.padroeiro,
              pratoTipico: dados.pratoTipico
            }
          });
          console.log(`✅ ${cidade.nome}`);
          atualizadas++;
        } else {
          console.log(`⚠️ Não encontrada: ${nome}`);
        }
      } catch (err) {
        console.log(`❌ Erro em ${nome}: ${err.message}`);
        erros++;
      }
    }

    console.log(`\n📊 RESUMO:`);
    console.log(`   Atualizadas: ${atualizadas}`);
    console.log(`   Erros: ${erros}`);

    // Verificar se ainda há cidades com dados incompletos
    const incompletas = await prisma.cidade.count({
      where: {
        OR: [
          { padroeiro: 'A definir' },
          { pratoTipico: 'A definir' },
          { breveHistorico: 'Histórico a ser preenchido' }
        ]
      }
    });
    console.log(`   Ainda incompletas: ${incompletas}`);

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

completarDadosCidades();
