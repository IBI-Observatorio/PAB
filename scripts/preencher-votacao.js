const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const csv = require('csv-parser');
const unzipper = require('unzipper');

const prisma = new PrismaClient();

const TEMP_DIR = path.join(__dirname, 'temp');

const TSE_URL = 'https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_candidato_munzona/votacao_candidato_munzona_2022.zip';

function normalizarNome(nome) {
  return nome
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

async function baixarArquivoTSE() {
  const filepath = path.join(TEMP_DIR, 'votacao_2022.zip');

  if (fs.existsSync(filepath)) {
    console.log('✓ Arquivo ZIP já existe, pulando download');
    return;
  }

  console.log('Baixando arquivo do TSE (pode demorar alguns minutos)...');

  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const response = await axios({
    method: 'GET',
    url: TSE_URL,
    responseType: 'stream',
    timeout: 600000,
  });

  const writer = fs.createWriteStream(filepath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      console.log('✓ Download concluído');
      resolve();
    });
    writer.on('error', reject);
  });
}

async function extrairZip() {
  const filepath = path.join(TEMP_DIR, 'votacao_2022.zip');
  console.log('Extraindo arquivo ZIP...');

  await fs.createReadStream(filepath)
    .pipe(unzipper.Extract({ path: TEMP_DIR }))
    .promise();

  console.log('✓ Extração concluída');
}

async function processarCSVVotacao(cidadesAlvo) {
  console.log('\nProcessando CSV de votação...');

  const files = fs.readdirSync(TEMP_DIR);
  const csvFile = files.find(f => f.includes('_SP.csv'));

  if (!csvFile) {
    throw new Error('Arquivo CSV de São Paulo não encontrado');
  }

  const csvPath = path.join(TEMP_DIR, csvFile);
  console.log(`Processando: ${csvFile}`);

  const dadosPorCidade = new Map();

  // Inicializar dados para cada cidade
  for (const [_, cidadeId] of cidadesAlvo) {
    dadosPorCidade.set(cidadeId, {
      votosPauloAlexandre2022: 0,
      votosOutrosDeputadosFederais2022: 0,
      votosPSDBTotal2022: 0,
      votosPSDTotal2022: 0,
      votosOutrosPartidos2022: 0,
      votosPresidente2022: { lula: 0, bolsonaro: 0, outros: 0 },
      votosGovernador2022: { tarcisio: 0, haddad: 0, outros: 0 },
      votosLegendaPSDB45: 0,
      votosLegendaPSD55: 0,
    });
  }

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath, { encoding: 'latin1' })
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        if (row['SG_UF'] !== 'SP') return;

        const nomeCidade = normalizarNome(row['NM_MUNICIPIO'] || '');
        const cidadeId = cidadesAlvo.get(nomeCidade);
        if (!cidadeId) return;

        const dados = dadosPorCidade.get(cidadeId);
        const cargo = row['CD_CARGO'];
        const partido = row['SG_PARTIDO'];
        const numeroUrna = row['NR_CANDIDATO'];
        const nomeUrna = (row['NM_URNA_CANDIDATO'] || '').toUpperCase();
        const votos = parseInt(row['QT_VOTOS_NOMINAIS'] || '0');

        // Deputado Federal (cargo 6)
        if (cargo === '6') {
          if (numeroUrna === '4545' || nomeUrna.includes('PAULO ALEXANDRE')) {
            dados.votosPauloAlexandre2022 += votos;
          } else {
            dados.votosOutrosDeputadosFederais2022 += votos;
          }

          if (partido === 'PSDB') {
            dados.votosPSDBTotal2022 += votos;
          } else if (partido === 'PSD') {
            dados.votosPSDTotal2022 += votos;
          } else {
            dados.votosOutrosPartidos2022 += votos;
          }
        }

        // Presidente (cargo 1)
        if (cargo === '1') {
          if (numeroUrna === '13' || nomeUrna.includes('LULA')) {
            dados.votosPresidente2022.lula += votos;
          } else if (numeroUrna === '22' || nomeUrna.includes('BOLSONARO')) {
            dados.votosPresidente2022.bolsonaro += votos;
          } else {
            dados.votosPresidente2022.outros += votos;
          }
        }

        // Governador (cargo 3)
        if (cargo === '3') {
          if (numeroUrna === '10' || nomeUrna.includes('TARCISIO') || nomeUrna.includes('TARCÍSIO')) {
            dados.votosGovernador2022.tarcisio += votos;
          } else if (numeroUrna === '13' || nomeUrna.includes('HADDAD')) {
            dados.votosGovernador2022.haddad += votos;
          } else {
            dados.votosGovernador2022.outros += votos;
          }
        }
      })
      .on('end', () => {
        console.log('✓ CSV processado');
        resolve(dadosPorCidade);
      })
      .on('error', reject);
  });
}

async function main() {
  console.log('=== PREENCHENDO DADOS DE VOTAÇÃO ===\n');

  // Buscar cidades sem dados de votação
  const cidadesSemVotacao = await prisma.cidade.findMany({
    where: { dadosVotacao: null },
    select: { id: true, nome: true }
  });

  console.log(`Cidades sem dados de votação: ${cidadesSemVotacao.length}`);

  if (cidadesSemVotacao.length === 0) {
    console.log('Todas as cidades já têm dados de votação!');
    return;
  }

  // Criar mapa de nomes normalizados para IDs
  const cidadesAlvo = new Map();
  for (const cidade of cidadesSemVotacao) {
    const nomeNormalizado = normalizarNome(cidade.nome);
    cidadesAlvo.set(nomeNormalizado, cidade.id);
  }

  // Verificar se arquivos já existem
  const files = fs.existsSync(TEMP_DIR) ? fs.readdirSync(TEMP_DIR) : [];
  const spFileExists = files.some(f => f.includes('_SP.csv'));

  if (!spFileExists) {
    await baixarArquivoTSE();
    await extrairZip();
  } else {
    console.log('✓ Arquivos CSV já existem, pulando download');
  }

  // Processar CSV
  const dadosPorCidade = await processarCSVVotacao(cidadesAlvo);

  // Inserir dados no banco
  console.log('\nInserindo dados no banco...');
  let inseridos = 0;

  for (const [cidadeId, dados] of dadosPorCidade) {
    const temDados = dados.votosPauloAlexandre2022 > 0 ||
                     dados.votosOutrosDeputadosFederais2022 > 0 ||
                     dados.votosPresidente2022.lula > 0 ||
                     dados.votosPresidente2022.bolsonaro > 0;

    if (!temDados) {
      const cidade = cidadesSemVotacao.find(c => c.id === cidadeId);
      console.log(`⚠ ${cidade?.nome}: Nenhum dado encontrado no TSE`);
      continue;
    }

    try {
      await prisma.dadosVotacao.create({
        data: {
          cidadeId: cidadeId,
          votosPauloAlexandre2022: dados.votosPauloAlexandre2022,
          votosOutrosDeputadosFederais2022: dados.votosOutrosDeputadosFederais2022,
          votosPSDBTotal2022: dados.votosPSDBTotal2022,
          votosPSDTotal2022: dados.votosPSDTotal2022,
          votosOutrosPartidos2022: dados.votosOutrosPartidos2022,
          votosPresidente2022: JSON.stringify(dados.votosPresidente2022),
          votosGovernador2022: JSON.stringify(dados.votosGovernador2022),
          votosLegendaPSDB45: dados.votosLegendaPSDB45,
          votosLegendaPSD55: dados.votosLegendaPSD55,
        }
      });

      const cidade = cidadesSemVotacao.find(c => c.id === cidadeId);
      console.log(`✓ ${cidade?.nome}: Dados inseridos`);
      inseridos++;
    } catch (error) {
      const cidade = cidadesSemVotacao.find(c => c.id === cidadeId);
      console.log(`✗ ${cidade?.nome}: Erro - ${error.message}`);
    }
  }

  console.log(`\n=== CONCLUÍDO ===`);
  console.log(`Cidades atualizadas: ${inseridos}/${cidadesSemVotacao.length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
