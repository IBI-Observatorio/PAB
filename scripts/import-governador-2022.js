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
  console.log('📊 Processando arquivo CSV para Governador SP...');

  // Usar o arquivo SP que já existe
  const csvPath = path.join(TEMP_DIR, 'votacao_candidato_munzona_2022_SP.csv');

  if (!fs.existsSync(csvPath)) {
    throw new Error('Arquivo votacao_candidato_munzona_2022_SP.csv não encontrado');
  }

  // Estrutura: Map<cidadeId, Map<candidato, votos>>
  const votosPorCidade = new Map();

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath, { encoding: 'latin1' })
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        // Filtrar apenas SP e Governador (cargo 3) e 2º turno
        const uf = row['SG_UF'];
        const cargo = row['CD_CARGO'];
        const turno = row['NR_TURNO'];

        if (uf !== 'SP' || cargo !== '3' || turno !== '2') return;

        const nomeCidade = normalizarNome(row['NM_MUNICIPIO'] || '');
        const cidadeId = cidadesMapa.get(nomeCidade);

        if (!cidadeId) return; // Cidade não está no nosso banco

        const candidato = row['NM_URNA_CANDIDATO'];
        const votos = parseInt(row['QT_VOTOS_NOMINAIS'] || '0');

        if (!votosPorCidade.has(cidadeId)) {
          votosPorCidade.set(cidadeId, new Map());
        }

        const votosCidade = votosPorCidade.get(cidadeId);
        const votosAtuais = votosCidade.get(candidato) || 0;
        votosCidade.set(candidato, votosAtuais + votos);
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
  let criadas = 0;

  for (const [cidadeId, candidatos] of votosPorCidade.entries()) {
    const votosGovernador = {};
    for (const [candidato, votos] of candidatos.entries()) {
      votosGovernador[candidato] = votos;
    }

    // Verificar se já existe dados de votação para esta cidade
    const existente = await prisma.dadosVotacao.findUnique({
      where: { cidadeId }
    });

    if (existente) {
      await prisma.dadosVotacao.update({
        where: { cidadeId },
        data: {
          votosGovernador2022: JSON.stringify(votosGovernador)
        }
      });
      atualizadas++;
    } else {
      // Criar novo registro de votação
      await prisma.dadosVotacao.create({
        data: {
          cidadeId,
          votosPauloAlexandre2022: 0,
          votosOutrosDeputadosFederais2022: 0,
          votosPSDBTotal2022: 0,
          votosPSDTotal2022: 0,
          votosOutrosPartidos2022: 0,
          votosPresidente2022: JSON.stringify({}),
          votosGovernador2022: JSON.stringify(votosGovernador),
          votosLegendaPSDB45: 0,
          votosLegendaPSD55: 0
        }
      });
      criadas++;
    }
  }

  console.log(`\n🎉 Atualização concluída!`);
  console.log(`📊 Registros atualizados: ${atualizadas}`);
  console.log(`📊 Registros criados: ${criadas}`);
}

async function main() {
  try {
    console.log('🚀 Iniciando importação de votos para Governador SP 2022\n');

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
        const votos = JSON.parse(c.dadosVotacao.votosGovernador2022 || '{}');
        console.log(`\n${c.nome}:`);
        Object.entries(votos).forEach(([candidato, qtd]) => {
          console.log(`  ${candidato}: ${qtd.toLocaleString('pt-BR')} votos`);
        });
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
