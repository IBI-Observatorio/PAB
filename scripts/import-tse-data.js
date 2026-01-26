const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');
const unzipper = require('unzipper');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Lista de cidades fornecidas
const CIDADES_ALVO = [
  'GUARULHOS', 'CAIEIRAS', 'MAIRIPORÃ', 'FRANCISCO MORATO', 'FRANCO DA ROCHA',
  'ARUJÁ', 'BIRITIBA MIRIM', 'GUARAREMA', 'ITAQUAQUECETUBA', 'MOGI DAS CRUZES',
  'POÁ', 'SALESÓPOLIS', 'SANTA ISABEL', 'SUZANO', 'IGARATÁ',
  'AMERICANA', 'AMPARO', 'ARARAS', 'CORDEIRÓPOLIS', 'ESTIVA GERBI',
  'HOLAMBRA', 'ITATIBA', 'JAGUARIÚNA', 'LEME', 'MOMBUCA',
  'MORUNGABA', 'PEDREIRA', 'PIRACICABA', 'SALTINHO', 'SANTA MARIA DA SERRA',
  'ÁGUAS DE LINDOIA', 'LINDÓIA', 'MONTE ALEGRE DO SUL', 'SERRA NEGRA', 'SOCORRO',
  'ATIBAIA', 'BOM JESUS DOS PERDÕES', 'BRAGANÇA PAULISTA', 'JOANÓPOLIS', 'NAZARÉ PAULISTA',
  'PEDRA BELA', 'PINHALZINHO', 'PIRACAIA', 'TUIUTI', 'VARGEM',
  'CABREÚVA', 'CAMPO LIMPO PAULISTA', 'ITUPEVA', 'JARINU', 'JUNDIAÍ',
  'LOUVEIRA', 'VÁRZEA PAULISTA', 'PORTO FERREIRA', 'CANAS', 'CRUZEIRO',
  'JACAREÍ', 'JAMBEIRO', 'LAVRINHAS', 'PINDAMONHANGABA', 'PIQUETE',
  'POTIM', 'ROSEIRA', 'SÃO JOSÉ DOS CAMPOS', 'TREMEMBÉ', 'ARAPEÍ',
  'AREIAS', 'QUELUZ', 'SÃO JOSÉ DO BARREIRO', 'SANTO ANTÔNIO DO PINHAL', 'SÃO BENTO DO SAPUCAÍ',
  'LAGOINHA', 'PARAIBUNA', 'SÃO LUÍS DO PARAITINGA', 'AGUAÍ', 'CASA BRANCA',
  'SÃO JOÃO DA BOA VISTA', 'TAMBAÚ', 'VARGEM GRANDE DO SUL', 'CACONDE', 'DIVINOLÂNDIA',
  'ITOBI', 'MOCOCA', 'ÁGUAS DA PRATA', 'ESPÍRITO SANTO DO PINHAL', 'SANTO ANTÔNIO DO JARDIM',
  'SANTA CRUZ DAS PALMEIRAS', 'SÃO JOSÉ DO RIO PARDO', 'SÃO SEBASTIÃO DA GRAMA', 'TAPIRATIBA', 'APARECIDA',
  'BANANAL', 'CAÇAPAVA', 'CACHOEIRA PAULISTA', 'CAMPOS DO JORDÃO', 'CUNHA',
  'GUARATINGUETÁ', 'LORENA', 'MONTEIRO LOBATO', 'NATIVIDADE DA SERRA', 'REDENÇÃO DA SERRA',
  'SILVEIRAS', 'TAUBATÉ', 'ILHABELA', 'CARAGUATATUBA', 'UBATUBA', 'SÃO SEBASTIÃO',
  // Baixada Santista (sem acentos para match com normalização)
  'SANTOS', 'CUBATAO', 'SAO VICENTE'
];

// URL do arquivo CSV do TSE - Votação nominal por município e zona (Todos os estados)
// Formato: votacao_candidato_munzona_2022.csv
const TSE_URL = 'https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2022.zip';

const TEMP_DIR = path.join(__dirname, 'temp');
const ZIP_FILE = path.join(TEMP_DIR, 'tse_sp_2022.zip');

async function baixarArquivoTSE() {
  console.log('📥 Baixando arquivo do TSE...');

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: TSE_URL,
      responseType: 'stream',
      timeout: 300000, // 5 minutos
    });

    const writer = fs.createWriteStream(ZIP_FILE);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('❌ Erro ao baixar arquivo:', error.message);
    throw error;
  }
}

async function extrairZip() {
  console.log('📦 Extraindo arquivo ZIP...');

  try {
    await fs.createReadStream(ZIP_FILE)
      .pipe(unzipper.Extract({ path: TEMP_DIR }))
      .promise();
    console.log('✅ Arquivo extraído com sucesso');
  } catch (error) {
    console.error('❌ Erro ao extrair ZIP:', error.message);
    throw error;
  }
}

function normalizarNome(nome) {
  return nome
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove acentos
}

async function processarCSV() {
  console.log('📊 Processando arquivo CSV...');

  // Procurar especificamente o arquivo de São Paulo
  const files = fs.readdirSync(TEMP_DIR);
  const csvFile = files.find(f => f.includes('_SP.csv'));

  if (!csvFile) {
    throw new Error('Arquivo CSV de São Paulo não encontrado após extração');
  }

  const csvPath = path.join(TEMP_DIR, csvFile);
  console.log(`📄 Processando: ${csvFile}`);

  const deputados = new Map(); // Map<cidadeId, Map<numeroUrna, deputadoData>>
  const cidadesEncontradas = new Set();

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath, { encoding: 'latin1' })
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        // Filtrar apenas São Paulo
        const uf = row['SG_UF'];
        if (uf !== 'SP') return;

        // Filtrar apenas deputados federais (cargo código 6)
        const cargo = row['CD_CARGO'];
        if (cargo !== '6') return;

        // Normalizar nome da cidade
        const nomeCidade = normalizarNome(row['NM_MUNICIPIO'] || '');

        // Verificar se é uma das cidades alvo
        if (!CIDADES_ALVO.includes(nomeCidade)) return;

        cidadesEncontradas.add(nomeCidade);

        const numeroUrna = row['NR_CANDIDATO'];
        const nome = row['NM_CANDIDATO'];
        const nomeUrna = row['NM_URNA_CANDIDATO'];
        const partido = row['SG_PARTIDO'];
        const votos = parseInt(row['QT_VOTOS_NOMINAIS'] || '0');

        // Usar nome da cidade como chave temporária
        if (!deputados.has(nomeCidade)) {
          deputados.set(nomeCidade, new Map());
        }

        const deputadosCidade = deputados.get(nomeCidade);

        if (!deputadosCidade.has(numeroUrna)) {
          deputadosCidade.set(numeroUrna, {
            nome,
            nomeUrna,
            partido,
            numeroUrna,
            votos: 0,
          });
        }

        // Somar votos (pode ter múltiplas zonas)
        deputadosCidade.get(numeroUrna).votos += votos;
      })
      .on('end', () => {
        console.log(`✅ CSV processado`);
        console.log(`📍 Cidades encontradas: ${cidadesEncontradas.size}`);
        console.log(`🗳️  Cidades com dados:`, Array.from(cidadesEncontradas).sort().join(', '));
        resolve(deputados);
      })
      .on('error', reject);
  });
}

async function popularBancoDados(deputadosPorCidade) {
  console.log('💾 Populando banco de dados...');

  let totalInseridos = 0;
  let cidadesProcessadas = 0;

  for (const [nomeCidade, deputadosMap] of deputadosPorCidade.entries()) {
    // Formatar nome da cidade (capitalizar)
    const nomeFormatado = nomeCidade
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Buscar ou criar cidade no banco
    let cidade = await prisma.cidade.findFirst({
      where: {
        nome: nomeFormatado,
      },
    });

    if (!cidade) {
      console.log(`⚠️  Cidade "${nomeFormatado}" não encontrada no banco. Criando...`);
      cidade = await prisma.cidade.create({
        data: {
          nome: nomeFormatado,
          gentilico: `Habitante de ${nomeFormatado}`,
          dataFundacao: new Date('1900-01-01'),
          dataAniversario: new Date('2024-01-01'),
          breveHistorico: 'História a ser adicionada',
          padroeiro: 'A definir',
          pratoTipico: 'A definir',
        },
      });
    }

    // Limpar deputados existentes desta cidade
    await prisma.deputadoFederal.deleteMany({
      where: { cidadeId: cidade.id },
    });

    // Inserir deputados
    const deputadosArray = Array.from(deputadosMap.values());

    for (const dep of deputadosArray) {
      await prisma.deputadoFederal.create({
        data: {
          cidadeId: cidade.id,
          nome: dep.nome,
          nomeUrna: dep.nomeUrna,
          partido: dep.partido,
          numeroUrna: dep.numeroUrna,
          votos2022: dep.votos,
          eleito: false, // Pode ser atualizado depois
        },
      });
      totalInseridos++;
    }

    cidadesProcessadas++;
    console.log(`✅ ${nomeCidade}: ${deputadosArray.length} deputados inseridos`);
  }

  console.log(`\n🎉 Importação concluída!`);
  console.log(`📊 Cidades processadas: ${cidadesProcessadas}`);
  console.log(`👥 Total de registros inseridos: ${totalInseridos}`);
}

async function limparArquivosTemp() {
  console.log('🧹 Limpeza de arquivos temporários desabilitada (arquivos mantidos para debug)');
  // if (fs.existsSync(TEMP_DIR)) {
  //   fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  // }
}

async function main() {
  try {
    console.log('🚀 Iniciando importação de dados do TSE\n');

    // Verificar se os arquivos já foram baixados
    const files = fs.existsSync(TEMP_DIR) ? fs.readdirSync(TEMP_DIR) : [];
    const spFileExists = files.some(f => f.includes('_SP.csv'));

    if (!spFileExists) {
      await baixarArquivoTSE();
      console.log('✅ Download concluído\n');

      await extrairZip();
      console.log('✅ Extração concluída\n');
    } else {
      console.log('✅ Arquivos já extraídos, pulando download e extração\n');
    }

    const deputadosPorCidade = await processarCSV();
    console.log('✅ Processamento concluído\n');

    await popularBancoDados(deputadosPorCidade);

    await limparArquivosTemp();
    console.log('✅ Limpeza concluída\n');

    console.log('✨ Processo finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
