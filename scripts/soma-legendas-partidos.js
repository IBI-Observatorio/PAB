const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const TEMP_DIR = path.join(__dirname, 'temp');

function normalizarNome(nome) {
  return nome
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
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
  console.log('📊 Processando votos de legenda de TODOS os partidos...\n');

  const csvPath = path.join(TEMP_DIR, 'votacao_partido_munzona_2022_SP.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error('Arquivo votacao_partido_munzona_2022_SP.csv não encontrado');
  }

  // Estrutura: Map<partido, totalVotos>
  const votosPorPartido = new Map();
  // Estrutura: Map<cidadeNome, Map<partido, votos>>
  const votosPorCidadePartido = new Map();
  let totalGeral = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath, { encoding: 'latin1' })
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        const uf = row['SG_UF'];
        const cargo = row['CD_CARGO'];

        // Filtrar apenas SP e Deputado Federal (cargo 6)
        if (uf !== 'SP' || cargo !== '6') return;

        const nomeCidade = normalizarNome(row['NM_MUNICIPIO'] || '');
        const cidadeId = cidadesMapa.get(nomeCidade);

        if (!cidadeId) return; // Cidade não está no nosso projeto

        const partido = row['SG_PARTIDO'];
        const votosLegenda = parseInt(row['QT_VOTOS_LEGENDA_VALIDOS'] || '0');

        // Somar por partido (total geral)
        const atual = votosPorPartido.get(partido) || 0;
        votosPorPartido.set(partido, atual + votosLegenda);

        // Somar por cidade e partido
        if (!votosPorCidadePartido.has(nomeCidade)) {
          votosPorCidadePartido.set(nomeCidade, new Map());
        }
        const cidadePartidos = votosPorCidadePartido.get(nomeCidade);
        const atualCidade = cidadePartidos.get(partido) || 0;
        cidadePartidos.set(partido, atualCidade + votosLegenda);

        totalGeral += votosLegenda;
      })
      .on('end', () => {
        resolve({ votosPorPartido, votosPorCidadePartido, totalGeral });
      })
      .on('error', reject);
  });
}

async function main() {
  try {
    console.log('🚀 Calculando somatório de votos de legenda por partido\n');
    console.log('Eleições 2022 - Deputado Federal - Cidades do projeto\n');
    console.log('='.repeat(60) + '\n');

    const cidadesMapa = await obterCidadesDoBanco();
    console.log(`📍 ${cidadesMapa.size} cidades no projeto\n`);

    const { votosPorPartido, votosPorCidadePartido, totalGeral } = await processarCSV(cidadesMapa);

    // Ordenar partidos por total de votos (decrescente)
    const partidosOrdenados = Array.from(votosPorPartido.entries())
      .sort((a, b) => b[1] - a[1]);

    console.log('📊 VOTOS DE LEGENDA POR PARTIDO (Total das 71 cidades):\n');
    console.log('-'.repeat(50));
    console.log('Partido'.padEnd(15) + 'Votos'.padStart(15) + '     %');
    console.log('-'.repeat(50));

    partidosOrdenados.forEach(([partido, votos]) => {
      const percentual = ((votos / totalGeral) * 100).toFixed(2);
      console.log(
        partido.padEnd(15) +
        votos.toLocaleString('pt-BR').padStart(15) +
        `   ${percentual}%`
      );
    });

    console.log('-'.repeat(50));
    console.log('TOTAL'.padEnd(15) + totalGeral.toLocaleString('pt-BR').padStart(15) + '   100%');
    console.log('\n');

    // Top 10 partidos
    console.log('🏆 TOP 10 PARTIDOS (por votos de legenda):\n');
    partidosOrdenados.slice(0, 10).forEach(([ partido, votos], i) => {
      const percentual = ((votos / totalGeral) * 100).toFixed(1);
      console.log(`${(i + 1).toString().padStart(2)}º ${partido.padEnd(10)} ${votos.toLocaleString('pt-BR').padStart(10)} votos (${percentual}%)`);
    });

    // Destacar PSDB e PSD
    console.log('\n');
    console.log('📌 DESTAQUE - PSDB e PSD:');
    const votosPSDB = votosPorPartido.get('PSDB') || 0;
    const votosPSD = votosPorPartido.get('PSD') || 0;
    const posicaoPSDB = partidosOrdenados.findIndex(([p]) => p === 'PSDB') + 1;
    const posicaoPSD = partidosOrdenados.findIndex(([p]) => p === 'PSD') + 1;

    console.log(`   PSDB (45): ${votosPSDB.toLocaleString('pt-BR')} votos (${((votosPSDB/totalGeral)*100).toFixed(2)}%) - ${posicaoPSDB}º lugar`);
    console.log(`   PSD (55):  ${votosPSD.toLocaleString('pt-BR')} votos (${((votosPSD/totalGeral)*100).toFixed(2)}%) - ${posicaoPSD}º lugar`);

    console.log('\n✨ Análise concluída!');

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
