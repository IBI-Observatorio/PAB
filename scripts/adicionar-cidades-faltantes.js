const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Função para normalizar nomes de cidades
function normalizarNome(nome) {
  if (!nome) return '';
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

// Função para converter valor do Excel para número
function parseValor(valor) {
  if (valor === null || valor === undefined || valor === '-' || valor === '') {
    return 0;
  }
  if (typeof valor === 'number') {
    return valor;
  }
  const num = parseFloat(String(valor).replace(/[^\d.,]/g, '').replace(',', '.'));
  return isNaN(num) ? 0 : num;
}

// Gerar gentílico a partir do nome da cidade
function gerarGentilico(nome) {
  const nomeBase = nome.trim().replace(/\s+/g, ' ');
  // Simplificação: adiciona "ense" ao nome
  if (nomeBase.endsWith('a') || nomeBase.endsWith('ã')) {
    return nomeBase.slice(0, -1) + 'ense';
  }
  return nomeBase + 'ense';
}

async function adicionarCidadesFaltantes() {
  try {
    // Encontrar o arquivo Excel
    const projectRoot = process.cwd();
    const files = fs.readdirSync(projectRoot).filter(f => f.endsWith('.xlsx'));
    const excelPath = path.join(projectRoot, files[0]);

    console.log(`📂 Lendo arquivo: ${files[0]}`);

    // Ler o Excel
    const workbook = XLSX.readFile(excelPath);
    const sheet = workbook.Sheets['Por município '];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Buscar todas as cidades do banco
    const cidadesBanco = await prisma.cidade.findMany({
      select: { id: true, nome: true }
    });

    // Criar mapa de cidades normalizadas
    const mapaCidades = new Map();
    cidadesBanco.forEach(c => {
      mapaCidades.set(normalizarNome(c.nome), c);
    });

    // Identificar cidades faltantes
    const cidadesFaltantes = new Map(); // nome original -> dados do Excel

    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      const municipio = row[1];
      if (!municipio) continue;

      const nomeNormalizado = normalizarNome(municipio);
      if (!mapaCidades.has(nomeNormalizado) && !cidadesFaltantes.has(nomeNormalizado)) {
        cidadesFaltantes.set(nomeNormalizado, {
          nomeOriginal: municipio.trim(),
          gestor: row[2],
          emendas2023: parseValor(row[3]),
          emendas2024: parseValor(row[4]),
          emendas2025: parseValor(row[5]),
          valorPago: parseValor(row[6]),
          valorAPagar: parseValor(row[7]),
          valorTotal: parseValor(row[8]),
          obs: row[9] || ''
        });
      }
    }

    console.log(`\n🏙️ Cidades faltantes: ${cidadesFaltantes.size}`);

    // Criar as cidades faltantes
    const cidadesCriadas = [];
    const dataBase = new Date('1900-01-01');

    for (const [nomeNorm, dados] of cidadesFaltantes) {
      console.log(`   Criando: ${dados.nomeOriginal}`);

      const novaCidade = await prisma.cidade.create({
        data: {
          nome: dados.nomeOriginal,
          gentilico: gerarGentilico(dados.nomeOriginal),
          dataFundacao: dataBase,
          dataAniversario: dataBase,
          breveHistorico: 'Histórico a ser preenchido',
          padroeiro: 'A definir',
          pratoTipico: 'A definir'
        }
      });

      cidadesCriadas.push({
        cidade: novaCidade,
        dados: dados
      });
    }

    console.log(`\n✅ ${cidadesCriadas.length} cidades criadas!`);

    // Criar emendas para as novas cidades
    const emendasParaInserir = [];

    for (const { cidade, dados } of cidadesCriadas) {
      if (dados.emendas2023 > 0) {
        emendasParaInserir.push({
          cidadeId: cidade.id,
          anoEmenda: 2023,
          descricao: `Emenda PAB 2023 - Gestor: ${dados.gestor}`,
          entidadeBeneficiada: dados.nomeOriginal,
          valorEmenda: dados.emendas2023,
          valorEmpenhado: dados.emendas2023,
          valorPago: dados.emendas2023,
          valorLiquidado: dados.emendas2023,
          autor: 'Paulo Alexandre Barbosa'
        });
      }

      if (dados.emendas2024 > 0) {
        emendasParaInserir.push({
          cidadeId: cidade.id,
          anoEmenda: 2024,
          descricao: `Emenda PAB 2024 - Gestor: ${dados.gestor}`,
          entidadeBeneficiada: dados.nomeOriginal,
          valorEmenda: dados.emendas2024,
          valorEmpenhado: dados.emendas2024,
          valorPago: dados.emendas2024,
          valorLiquidado: dados.emendas2024,
          autor: 'Paulo Alexandre Barbosa'
        });
      }

      if (dados.emendas2025 > 0) {
        const totalAnterior = dados.emendas2023 + dados.emendas2024;
        const pagoAteAgora = dados.valorPago - totalAnterior;
        const pago2025 = Math.max(0, Math.min(pagoAteAgora, dados.emendas2025));

        emendasParaInserir.push({
          cidadeId: cidade.id,
          anoEmenda: 2025,
          descricao: `Emenda PAB 2025 - Gestor: ${dados.gestor}${dados.obs ? ' - ' + dados.obs : ''}`,
          entidadeBeneficiada: dados.nomeOriginal,
          valorEmenda: dados.emendas2025,
          valorEmpenhado: dados.emendas2025,
          valorPago: pago2025,
          valorLiquidado: pago2025,
          autor: 'Paulo Alexandre Barbosa'
        });
      }
    }

    if (emendasParaInserir.length > 0) {
      console.log(`\n📥 Inserindo ${emendasParaInserir.length} emendas das novas cidades...`);
      const resultado = await prisma.emenda.createMany({
        data: emendasParaInserir
      });
      console.log(`   Inseridas: ${resultado.count} emendas`);
    }

    // Resumo final
    const totalCidades = await prisma.cidade.count();
    const totalEmendas = await prisma.emenda.count();

    console.log('\n📊 RESUMO FINAL:');
    console.log(`   Total de cidades no banco: ${totalCidades}`);
    console.log(`   Total de emendas no banco: ${totalEmendas}`);

    // Mostrar cidades com mais emendas
    console.log('\n📋 Cidades com emendas (por valor total):');
    const emendasPorCidade = await prisma.emenda.groupBy({
      by: ['cidadeId'],
      _sum: { valorEmenda: true },
      orderBy: { _sum: { valorEmenda: 'desc' } },
      take: 15
    });

    for (const e of emendasPorCidade) {
      const cidade = await prisma.cidade.findUnique({
        where: { id: e.cidadeId },
        select: { nome: true }
      });
      console.log(`   ${cidade.nome}: R$ ${e._sum.valorEmenda?.toLocaleString('pt-BR') || 0}`);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

adicionarCidadesFaltantes();
