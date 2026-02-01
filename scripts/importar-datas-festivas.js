/**
 * Script para importar Datas Históricas e Festivas Municipais do CSV
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Mapeamento de nomes abreviados no CSV para nomes completos no banco
const MAPEAMENTO_NOMES = {
  'B. Jesus Perdões': 'Bom Jesus dos Perdões',
  'Bragança Paul.': 'Bragança Paulista',
  'Cachoeira Paul.': 'Cachoeira Paulista',
  'C. Limpo Paul.': 'Campo Limpo Paulista',
  'Campos Jordão': 'Campos do Jordão',
  'E. Santo Pinhal': 'Espírito Santo do Pinhal',
  'M. Alegre Do Sul': 'Monte Alegre Do Sul',
  'Natividade Serra': 'Natividade Da Serra',
  'Redenção Serra': 'Redenção da Serra',
  'S. Cruz Palmeiras': 'Santa Cruz Das Palmeiras',
  'Sta. Maria Serra': 'Santa Maria Da Serra',
  'Sto. Antônio Jardim': 'Santo Antônio do Jardim',
  'Sto. Ant. Pinhal': 'Santo Antônio do Pinhal',
  'S. Bento Sapucaí': 'São Bento do Sapucaí',
  'S. João Boa Vista': 'São João da Boa Vista',
  'S. José Barreiro': 'São José do Barreiro',
  'S. José Rio Pardo': 'São José do Rio Pardo',
  'S. José Campos': 'São José dos Campos',
  'S. Luís Paraitinga': 'São Luís do Paraitinga',
  'S. Sebastião Grama': 'São Sebastião da Grama',
  'V. Grande Do Sul': 'Vargem Grande Do Sul'
};

function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.trim());

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Parse CSV considerando vírgulas dentro de aspas
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    if (values.length >= 4) {
      data.push({
        numero: values[0],
        cidade: values[1],
        datasHistoricas: values[2],
        periodoFestas: values[3]
      });
    }
  }

  return data;
}

async function main() {
  console.log('='.repeat(60));
  console.log('IMPORTAR DATAS HISTORICAS E FESTIVAS MUNICIPAIS');
  console.log('='.repeat(60));
  console.log('');

  // Ler arquivo CSV
  const csvPath = path.join(__dirname, '..', 'public', 'arquivos', 'Datas Históricas e Festivas Municipais.csv');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const dados = parseCSV(content);

  console.log(`Registros no CSV: ${dados.length}`);
  console.log('');

  let atualizadas = 0;
  let naoEncontradas = [];

  for (const registro of dados) {
    // Mapear nome se necessário
    let nomeCidade = registro.cidade;
    if (MAPEAMENTO_NOMES[nomeCidade]) {
      nomeCidade = MAPEAMENTO_NOMES[nomeCidade];
    }

    // Buscar cidade no banco
    const cidade = await prisma.cidade.findFirst({
      where: {
        OR: [
          { nome: nomeCidade },
          { nome: { contains: nomeCidade.split(' ')[0], mode: 'insensitive' } }
        ]
      }
    });

    if (!cidade) {
      // Tentar busca mais flexível
      const cidadeFlexivel = await prisma.cidade.findFirst({
        where: {
          nome: { contains: registro.cidade.split(' ')[0], mode: 'insensitive' }
        }
      });

      if (cidadeFlexivel) {
        await prisma.cidade.update({
          where: { id: cidadeFlexivel.id },
          data: {
            datasHistoricas: registro.datasHistoricas,
            periodoFestas: registro.periodoFestas
          }
        });
        atualizadas++;
        console.log(`[OK] ${cidadeFlexivel.nome} (encontrado como ${registro.cidade})`);
      } else {
        naoEncontradas.push(registro.cidade);
        console.log(`[??] ${registro.cidade} - NAO ENCONTRADA`);
      }
      continue;
    }

    // Atualizar cidade
    await prisma.cidade.update({
      where: { id: cidade.id },
      data: {
        datasHistoricas: registro.datasHistoricas,
        periodoFestas: registro.periodoFestas
      }
    });

    atualizadas++;
    console.log(`[OK] ${cidade.nome}`);
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('RESUMO');
  console.log('='.repeat(60));
  console.log(`Cidades atualizadas: ${atualizadas}`);

  if (naoEncontradas.length > 0) {
    console.log(`\nCidades nao encontradas (${naoEncontradas.length}):`);
    naoEncontradas.forEach(c => console.log(`  - ${c}`));
  }

  console.log('='.repeat(60));
}

main()
  .catch((e) => {
    console.error('Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
