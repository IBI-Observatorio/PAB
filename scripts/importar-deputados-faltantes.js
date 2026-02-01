const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();
const TEMP_DIR = path.join(__dirname, 'temp');

function normalizarNome(nome) {
  return nome.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function importarDeputados() {
  // Buscar todas as cidades sem deputados
  const cidadesSemDeputados = await prisma.cidade.findMany({
    where: {
      deputadosFederais: { none: {} }
    },
    select: { id: true, nome: true }
  });

  console.log('Cidades sem deputados:', cidadesSemDeputados.length);
  console.log('Cidades:', cidadesSemDeputados.map(c => c.nome).join(', '));

  if (cidadesSemDeputados.length === 0) {
    console.log('Todas as cidades já têm deputados!');
    return;
  }

  // Criar mapa de nomes normalizados
  const cidadesMap = new Map();
  cidadesSemDeputados.forEach(c => {
    cidadesMap.set(normalizarNome(c.nome), c.id);
  });

  // Processar CSV
  const csvPath = path.join(TEMP_DIR, 'votacao_candidato_munzona_2022_SP.csv');

  if (!fs.existsSync(csvPath)) {
    console.log('Arquivo CSV não encontrado:', csvPath);
    return;
  }

  const deputados = new Map();

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvPath, { encoding: 'latin1' })
      .pipe(csv({ separator: ';' }))
      .on('data', (row) => {
        if (row['SG_UF'] !== 'SP') return;
        if (row['CD_CARGO'] !== '6') return; // Deputado Federal

        const nomeCidade = normalizarNome(row['NM_MUNICIPIO'] || '');
        const cidadeId = cidadesMap.get(nomeCidade);
        if (!cidadeId) return;

        if (!deputados.has(cidadeId)) {
          deputados.set(cidadeId, new Map());
        }

        const numeroUrna = row['NR_CANDIDATO'];
        const depMap = deputados.get(cidadeId);

        if (!depMap.has(numeroUrna)) {
          depMap.set(numeroUrna, {
            nome: row['NM_CANDIDATO'],
            nomeUrna: row['NM_URNA_CANDIDATO'],
            partido: row['SG_PARTIDO'],
            numeroUrna: numeroUrna,
            votos: 0
          });
        }
        depMap.get(numeroUrna).votos += parseInt(row['QT_VOTOS_NOMINAIS'] || '0');
      })
      .on('end', resolve)
      .on('error', reject);
  });

  console.log('\nCidades com dados encontrados:', deputados.size);

  // Inserir no banco
  let totalInseridos = 0;
  for (const [cidadeId, depMap] of deputados) {
    const cidade = cidadesSemDeputados.find(c => c.id === cidadeId);
    const deps = Array.from(depMap.values());

    // Limpar existentes
    await prisma.deputadoFederal.deleteMany({ where: { cidadeId } });

    // Inserir top 20 mais votados
    const top20 = deps.sort((a, b) => b.votos - a.votos).slice(0, 20);

    for (const dep of top20) {
      await prisma.deputadoFederal.create({
        data: {
          cidadeId,
          nome: dep.nome,
          nomeUrna: dep.nomeUrna,
          partido: dep.partido,
          numeroUrna: dep.numeroUrna,
          votos2022: dep.votos,
          eleito: false
        }
      });
    }
    console.log(cidade.nome + ': ' + top20.length + ' deputados inseridos');
    totalInseridos++;
  }

  console.log('\n=== CONCLUÍDO ===');
  console.log('Total de cidades atualizadas:', totalInseridos);
}

importarDeputados()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
