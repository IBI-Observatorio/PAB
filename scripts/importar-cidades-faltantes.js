/**
 * Script para importar as 43 cidades faltantes do CSV
 * Combina dados do arquivo Municipio_43_faltantes.csv com Datas Históricas e Festivas Municipais.csv
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Mapeamento de nomes para encontrar correspondência entre os arquivos
const MAPEAMENTO_DATAS_FESTIVAS = {
  'Bento de Abreu': 'Bento De Abreu'
};

function parseCSVSemicolon(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(';').map(h => h.trim());

  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';').map(v => v.trim());

    if (values.length >= 7) {
      data.push({
        municipio: values[0],
        gentilico: values[1],
        fundacaoEmancipacao: values[2],
        aniversario: values[3],
        padroeiro: values[4],
        pratoTipico: values[5],
        historicoDetalhado: values[6]
      });
    }
  }

  return data;
}

function parseCSVComma(content) {
  const lines = content.split('\n').filter(line => line.trim());

  const data = {};

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
      const cidade = values[1];
      data[cidade] = {
        datasHistoricas: values[2],
        periodoFestas: values[3]
      };
    }
  }

  return data;
}

function parseDate(dateStr, isFullDate = true) {
  // Formato: DD/MM/YYYY ou DD/MM
  const parts = dateStr.split('/');

  if (isFullDate && parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // meses começam em 0
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day, 12, 0, 0);
  } else if (!isFullDate && parts.length >= 2) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    // Para aniversário, usar ano base 2024
    return new Date(2024, month, day, 12, 0, 0);
  }

  // Fallback
  return new Date(2024, 0, 1, 12, 0, 0);
}

async function main() {
  console.log('='.repeat(60));
  console.log('IMPORTAR 43 CIDADES FALTANTES');
  console.log('='.repeat(60));
  console.log('');

  // Ler arquivo de cidades faltantes
  const cidadesPath = path.join(__dirname, '..', 'public', 'arquivos', 'Municipio_43_faltantes.csv');
  const cidadesContent = fs.readFileSync(cidadesPath, 'utf-8');
  const cidades = parseCSVSemicolon(cidadesContent);

  console.log(`Cidades no arquivo: ${cidades.length}`);

  // Ler arquivo de datas festivas
  const datasPath = path.join(__dirname, '..', 'public', 'arquivos', 'Datas Históricas e Festivas Municipais.csv');
  const datasContent = fs.readFileSync(datasPath, 'utf-8');
  const datasFestivas = parseCSVComma(datasContent);

  console.log(`Registros de datas festivas: ${Object.keys(datasFestivas).length}`);
  console.log('');

  let criadas = 0;
  let atualizadas = 0;
  let erros = [];

  for (const cidade of cidades) {
    try {
      // Verificar se cidade já existe
      const cidadeExistente = await prisma.cidade.findFirst({
        where: {
          OR: [
            { nome: cidade.municipio },
            { nome: { equals: cidade.municipio, mode: 'insensitive' } }
          ]
        }
      });

      // Buscar datas festivas correspondentes
      let datasHistoricas = null;
      let periodoFestas = null;

      // Tentar encontrar no mapeamento
      const nomeMapeado = MAPEAMENTO_DATAS_FESTIVAS[cidade.municipio];
      if (nomeMapeado && datasFestivas[nomeMapeado]) {
        datasHistoricas = datasFestivas[nomeMapeado].datasHistoricas;
        periodoFestas = datasFestivas[nomeMapeado].periodoFestas;
      } else if (datasFestivas[cidade.municipio]) {
        datasHistoricas = datasFestivas[cidade.municipio].datasHistoricas;
        periodoFestas = datasFestivas[cidade.municipio].periodoFestas;
      }

      const dadosCidade = {
        nome: cidade.municipio,
        gentilico: cidade.gentilico,
        dataFundacao: parseDate(cidade.fundacaoEmancipacao, true),
        dataAniversario: parseDate(cidade.aniversario, false),
        padroeiro: cidade.padroeiro,
        pratoTipico: cidade.pratoTipico,
        breveHistorico: cidade.historicoDetalhado,
        datasHistoricas: datasHistoricas,
        periodoFestas: periodoFestas
      };

      if (cidadeExistente) {
        // Atualizar cidade existente
        await prisma.cidade.update({
          where: { id: cidadeExistente.id },
          data: dadosCidade
        });
        atualizadas++;
        console.log(`[ATUALIZADO] ${cidade.municipio}`);
      } else {
        // Criar nova cidade
        await prisma.cidade.create({
          data: dadosCidade
        });
        criadas++;
        console.log(`[CRIADO] ${cidade.municipio}`);
      }

    } catch (error) {
      erros.push({ cidade: cidade.municipio, erro: error.message });
      console.log(`[ERRO] ${cidade.municipio}: ${error.message}`);
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('RESUMO');
  console.log('='.repeat(60));
  console.log(`Cidades criadas: ${criadas}`);
  console.log(`Cidades atualizadas: ${atualizadas}`);

  if (erros.length > 0) {
    console.log(`\nErros (${erros.length}):`);
    erros.forEach(e => console.log(`  - ${e.cidade}: ${e.erro}`));
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
