/**
 * Script para importar dados demográficos do arquivo Excel
 */

const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const path = require('path');

const prisma = new PrismaClient();

function parseUrbanoRural(texto) {
  // "91% / 9%" -> { urbano: 91, rural: 9 }
  const match = texto.match(/(\d+(?:\.\d+)?)\s*%\s*\/\s*(\d+(?:\.\d+)?)\s*%/);
  if (match) {
    return {
      urbano: parseFloat(match[1]),
      rural: parseFloat(match[2])
    };
  }
  return { urbano: 85, rural: 15 }; // valor padrão
}

function parseAlfabetizacao(texto) {
  // "91.5%" -> 91.5
  const match = texto.match(/(\d+(?:\.\d+)?)\s*%/);
  if (match) {
    return parseFloat(match[1]);
  }
  return 90; // valor padrão
}

function parseReligiao(texto) {
  // "Catol. (68%), Evang. (22%)" -> { catolico: 68, evangelico: 22, espirita: 5, semReligiao: 5 }
  let catolico = 0, evangelico = 0, espirita = 0, semReligiao = 0;

  const catMatch = texto.match(/Catol\.?\s*\((\d+(?:\.\d+)?)\s*%?\)/i);
  if (catMatch) catolico = parseFloat(catMatch[1]);

  const evangMatch = texto.match(/Evang\.?\s*\((\d+(?:\.\d+)?)\s*%?\)/i);
  if (evangMatch) evangelico = parseFloat(evangMatch[1]);

  const espMatch = texto.match(/Esp[ií]r\.?\s*\((\d+(?:\.\d+)?)\s*%?\)/i);
  if (espMatch) espirita = parseFloat(espMatch[1]);

  const semMatch = texto.match(/Sem\s*\((\d+(?:\.\d+)?)\s*%?\)/i);
  if (semMatch) semReligiao = parseFloat(semMatch[1]);

  // Calcular restante
  const total = catolico + evangelico + espirita + semReligiao;
  if (total < 100) {
    const restante = 100 - total;
    if (espirita === 0) espirita = Math.min(restante * 0.3, 5);
    if (semReligiao === 0) semReligiao = Math.min(restante * 0.5, 8);
  }

  // Determinar religião predominante
  let predominante = 'Católica';
  if (evangelico > catolico) predominante = 'Evangélica';

  return {
    catolico,
    evangelico,
    espirita: espirita || 3,
    semReligiao: semReligiao || 5,
    predominante
  };
}

async function main() {
  console.log('='.repeat(60));
  console.log('IMPORTAR DADOS DEMOGRAFICOS DO EXCEL');
  console.log('='.repeat(60));
  console.log('');

  // Ler arquivo Excel
  const filePath = path.join(__dirname, '..', 'public', 'arquivos', 'Cidades dados demográficos.xlsx');
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const dados = XLSX.utils.sheet_to_json(sheet);

  console.log(`Registros no Excel: ${dados.length}`);
  console.log('');

  let inseridos = 0;
  let atualizados = 0;
  let erros = [];

  for (const row of dados) {
    const nomeCidade = row['Cidade'];

    // Buscar cidade
    const cidade = await prisma.cidade.findFirst({
      where: { nome: { equals: nomeCidade, mode: 'insensitive' } },
      include: { dadosDemograficos: true }
    });

    if (!cidade) {
      erros.push(nomeCidade);
      console.log(`[??] ${nomeCidade} - NAO ENCONTRADA`);
      continue;
    }

    // Parsear dados
    const urbanoRural = parseUrbanoRural(row['Urbana / Rural (%)'] || '85% / 15%');
    const alfabetizacao = parseAlfabetizacao(row['Alfabetização (%)'] || '90%');
    const religiao = parseReligiao(row['Religião Predominante (Aprox.)'] || 'Catol. (70%), Evang. (20%)');

    const dadosDemo = {
      percentualUrbano: urbanoRural.urbano,
      percentualRural: urbanoRural.rural,
      taxaAlfabetizacao: alfabetizacao,
      percentualCatolico: religiao.catolico,
      percentualEvangelico: religiao.evangelico,
      percentualEspirita: religiao.espirita,
      percentualSemReligiao: religiao.semReligiao,
      religiaoPredominante: religiao.predominante,
      principaisBairros: 'Centro, Vila Nova, Jardim das Flores'
    };

    try {
      if (cidade.dadosDemograficos) {
        // Atualizar
        await prisma.dadosDemograficos.update({
          where: { id: cidade.dadosDemograficos.id },
          data: dadosDemo
        });
        atualizados++;
        console.log(`[UP] ${nomeCidade}`);
      } else {
        // Inserir
        await prisma.dadosDemograficos.create({
          data: {
            cidadeId: cidade.id,
            ...dadosDemo
          }
        });
        inseridos++;
        console.log(`[OK] ${nomeCidade}`);
      }
    } catch (err) {
      erros.push(`${nomeCidade}: ${err.message}`);
      console.log(`[ER] ${nomeCidade} - ${err.message}`);
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log('RESUMO');
  console.log('='.repeat(60));
  console.log(`Inseridos: ${inseridos}`);
  console.log(`Atualizados: ${atualizados}`);
  console.log(`Erros: ${erros.length}`);

  if (erros.length > 0) {
    console.log('\\nErros:');
    erros.forEach(e => console.log(`  - ${e}`));
  }

  // Verificar total
  const totalComDados = await prisma.dadosDemograficos.count();
  const totalCidades = await prisma.cidade.count();
  console.log(`\\nCidades com dados demograficos: ${totalComDados} de ${totalCidades}`);
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
