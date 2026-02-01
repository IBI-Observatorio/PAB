const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();
const TEMP_DIR = path.join(__dirname, 'temp');

function normalizarNome(nome) {
  return nome.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function corrigirDeputados() {
  // Buscar TODAS as cidades
  const todasCidades = await prisma.cidade.findMany({
    select: { id: true, nome: true }
  });

  console.log('Total de cidades:', todasCidades.length);

  // Criar mapa de nomes normalizados
  const cidadesMap = new Map();
  todasCidades.forEach(c => {
    cidadesMap.set(normalizarNome(c.nome), c.id);
  });

  // Processar CSV
  const csvPath = path.join(TEMP_DIR, 'votacao_candidato_munzona_2022_SP.csv');

  if (!fs.existsSync(csvPath)) {
    console.log('Arquivo CSV não encontrado:', csvPath);
    return;
  }

  const deputados = new Map();

  console.log('Processando CSV...');

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

  console.log('CSV processado. Cidades com dados:', deputados.size);

  // Atualizar cada cidade
  let atualizadas = 0;
  for (const [cidadeId, depMap] of deputados) {
    const cidade = todasCidades.find(c => c.id === cidadeId);
    const deps = Array.from(depMap.values());

    // Ordenar por votos
    deps.sort((a, b) => b.votos - a.votos);

    // Encontrar Paulo Alexandre Barbosa (numero 4533)
    const pauloIndex = deps.findIndex(d =>
      d.nomeUrna.includes('PAULO ALEXANDRE') ||
      d.numeroUrna === '4533'
    );

    const paulo = pauloIndex >= 0 ? deps[pauloIndex] : null;

    // Pegar top 5 mais votados com suas posições reais
    let selecionados = deps.slice(0, 5).map((dep, idx) => ({
      ...dep,
      posicao: idx + 1  // Posição real: 1, 2, 3, 4, 5
    }));

    // Se Paulo Alexandre não está no top 5 mas tem votos, adicionar ele com posição real
    if (paulo && pauloIndex >= 5) {
      selecionados.push({
        ...paulo,
        posicao: pauloIndex + 1  // Posição real dele (ex: 47º lugar)
      });
    }

    // Limpar existentes
    await prisma.deputadoFederal.deleteMany({ where: { cidadeId } });

    // Inserir
    for (const dep of selecionados) {
      await prisma.deputadoFederal.create({
        data: {
          cidadeId,
          nome: dep.nome,
          nomeUrna: dep.nomeUrna,
          partido: dep.partido,
          numeroUrna: dep.numeroUrna,
          votos2022: dep.votos,
          posicao: dep.posicao,
          eleito: false
        }
      });
    }

    const pauloPos = pauloIndex >= 0 ? pauloIndex + 1 : 'N/A';
    const pauloVotos = paulo ? paulo.votos : 0;
    console.log(`${cidade.nome}: ${selecionados.length} deps | Paulo Alexandre: pos ${pauloPos}, ${pauloVotos} votos`);
    atualizadas++;
  }

  console.log('\n=== CONCLUÍDO ===');
  console.log('Cidades atualizadas:', atualizadas);
}

corrigirDeputados()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
