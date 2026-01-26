const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');
const unzipper = require('unzipper');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// URL do arquivo de votação por partido (legenda)
const TSE_URL = 'https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_partido_munzona/votacao_partido_munzona_2022.zip';

const TEMP_DIR = path.join(__dirname, 'temp');
const ZIP_FILE = path.join(TEMP_DIR, 'votacao_partido_2022.zip');

function normalizarNome(nome) {
  return nome
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

async function baixarArquivo() {
  console.log('📥 Baixando arquivo de votos de legenda do TSE...');

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: TSE_URL,
      responseType: 'stream',
      timeout: 600000,
      onDownloadProgress: (progressEvent) => {
        const mb = (progressEvent.loaded / 1024 / 1024).toFixed(1);
        process.stdout.write(`\r📥 Baixando: ${mb} MB`);
      }
    });

    const writer = fs.createWriteStream(ZIP_FILE);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log('\n✅ Download concluído');
        resolve();
      });
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

async function obterCidadesDoBanco() {
  const cidades = await prisma.cidade.findMany({
    select: { id: true, nome: true }
  });

  const mapa = new Map();
  cidades.forEach(c => {
    mapa.set(normalizarNome(c.nome), c.id);
  });

  return mapa;
}

async function processarCSV(cidadesMapa) {
  console.log('📊 Processando arquivo CSV de votos de legenda...');

  // Procurar arquivo SP
  const files = fs.readdirSync(TEMP_DIR);
  const csvFile = files.find(f => f.includes('partido') && f.includes('_SP.csv'));

  if (!csvFile) {
    throw new Error('Arquivo de votação por partido SP não encontrado');
  }

  const csvPath = path.join(TEMP_DIR, csvFile);
  console.log(`📄 Processando: ${csvFile}`);

  // Estrutura: Map<cidadeId, { psdb: votos, psd: votos }>
  const votosPorCidade = new Map();

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath, { encoding: 'latin1' })
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        // Filtrar apenas SP e Deputado Federal (cargo 6)
        const uf = row['SG_UF'];
        const cargo = row['CD_CARGO'];

        if (uf !== 'SP' || cargo !== '6') return;

        const nomeCidade = normalizarNome(row['NM_MUNICIPIO'] || '');
        const cidadeId = cidadesMapa.get(nomeCidade);

        if (!cidadeId) return;

        const partido = row['SG_PARTIDO'];
        const numeroPartido = row['NR_PARTIDO'];
        const votosLegenda = parseInt(row['QT_VOTOS_LEGENDA_VALIDOS'] || '0');

        if (!votosPorCidade.has(cidadeId)) {
          votosPorCidade.set(cidadeId, { psdb: 0, psd: 0 });
        }

        const votos = votosPorCidade.get(cidadeId);

        // PSDB = 45
        if (numeroPartido === '45' || partido === 'PSDB') {
          votos.psdb += votosLegenda;
        }
        // PSD = 55
        if (numeroPartido === '55' || partido === 'PSD') {
          votos.psd += votosLegenda;
        }
      })
      .on('end', () => {
        console.log(`✅ Processamento concluído`);
        console.log(`📍 Cidades com dados: ${votosPorCidade.size}`);
        resolve(votosPorCidade);
      })
      .on('error', reject);
  });
}

async function atualizarBancoDados(votosPorCidade) {
  console.log('💾 Atualizando banco de dados...');

  let atualizadas = 0;

  for (const [cidadeId, votos] of votosPorCidade.entries()) {
    const existente = await prisma.dadosVotacao.findUnique({
      where: { cidadeId }
    });

    if (existente) {
      await prisma.dadosVotacao.update({
        where: { cidadeId },
        data: {
          votosLegendaPSDB45: votos.psdb,
          votosLegendaPSD55: votos.psd
        }
      });
      atualizadas++;
    } else {
      await prisma.dadosVotacao.create({
        data: {
          cidadeId,
          votosPauloAlexandre2022: 0,
          votosOutrosDeputadosFederais2022: 0,
          votosPSDBTotal2022: 0,
          votosPSDTotal2022: 0,
          votosOutrosPartidos2022: 0,
          votosPresidente2022: JSON.stringify({}),
          votosGovernador2022: JSON.stringify({}),
          votosLegendaPSDB45: votos.psdb,
          votosLegendaPSD55: votos.psd
        }
      });
      atualizadas++;
    }
  }

  console.log(`\n🎉 Atualização concluída!`);
  console.log(`📊 Registros atualizados: ${atualizadas}`);
}

async function main() {
  try {
    console.log('🚀 Iniciando importação de votos de legenda PSDB (45) e PSD (55)\n');

    // Verificar se arquivo já existe
    const files = fs.existsSync(TEMP_DIR) ? fs.readdirSync(TEMP_DIR) : [];
    const partidoFileExists = files.some(f => f.includes('partido') && f.includes('_SP.csv'));

    if (!partidoFileExists) {
      await baixarArquivo();
      await extrairZip();
    } else {
      console.log('✅ Arquivo de legenda já existe, pulando download\n');
    }

    const cidadesMapa = await obterCidadesDoBanco();
    console.log(`📍 ${cidadesMapa.size} cidades no banco de dados\n`);

    const votosPorCidade = await processarCSV(cidadesMapa);
    await atualizarBancoDados(votosPorCidade);

    // Mostrar alguns exemplos
    console.log('\n📋 Exemplos de dados importados:');
    const exemplos = await prisma.cidade.findMany({
      where: { nome: { in: ['Santos', 'Americana', 'Guarulhos', 'Cubatão'] } },
      include: { dadosVotacao: true }
    });

    exemplos.forEach(c => {
      if (c.dadosVotacao) {
        console.log(`\n${c.nome}:`);
        console.log(`  PSDB (45): ${c.dadosVotacao.votosLegendaPSDB45.toLocaleString('pt-BR')} votos`);
        console.log(`  PSD (55): ${c.dadosVotacao.votosLegendaPSD55.toLocaleString('pt-BR')} votos`);
      }
    });

    console.log('\n✨ Processo finalizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
