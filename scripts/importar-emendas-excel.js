const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Função para normalizar nomes de cidades (remover acentos, espaços extras, etc.)
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
  // Tentar converter string para número
  const num = parseFloat(String(valor).replace(/[^\d.,]/g, '').replace(',', '.'));
  return isNaN(num) ? 0 : num;
}

async function importarEmendas() {
  try {
    // Encontrar o arquivo Excel
    const projectRoot = process.cwd();
    const files = fs.readdirSync(projectRoot).filter(f => f.endsWith('.xlsx'));

    if (files.length === 0) {
      throw new Error('Nenhum arquivo Excel encontrado na raiz do projeto');
    }

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

    console.log(`\n📊 Cidades no banco: ${cidadesBanco.length}`);
    console.log(`📊 Linhas no Excel: ${data.length - 2}`); // -2 para header

    // Processar dados do Excel (pular header)
    const emendasParaInserir = [];
    const cidadesNaoEncontradas = [];
    const cidadesAtualizadas = new Set();

    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      const municipio = row[1];
      const gestor = row[2];
      const emendas2023 = parseValor(row[3]);
      const emendas2024 = parseValor(row[4]);
      const emendas2025 = parseValor(row[5]);
      const valorPago = parseValor(row[6]);
      const valorAPagar = parseValor(row[7]);
      const valorTotal = parseValor(row[8]);
      const obs = row[9] || '';

      if (!municipio) continue;

      // Buscar cidade no banco
      const nomeNormalizado = normalizarNome(municipio);
      const cidade = mapaCidades.get(nomeNormalizado);

      if (!cidade) {
        cidadesNaoEncontradas.push(municipio);
        continue;
      }

      cidadesAtualizadas.add(cidade.id);

      // Criar emendas por ano (apenas se tiver valor > 0)
      if (emendas2023 > 0) {
        emendasParaInserir.push({
          cidadeId: cidade.id,
          anoEmenda: 2023,
          descricao: `Emenda PAB 2023 - Gestor: ${gestor}`,
          entidadeBeneficiada: municipio,
          valorEmenda: emendas2023,
          valorEmpenhado: emendas2023,
          valorPago: emendas2023, // Considera 2023 já pago
          valorLiquidado: emendas2023,
          autor: 'Paulo Alexandre Barbosa'
        });
      }

      if (emendas2024 > 0) {
        emendasParaInserir.push({
          cidadeId: cidade.id,
          anoEmenda: 2024,
          descricao: `Emenda PAB 2024 - Gestor: ${gestor}`,
          entidadeBeneficiada: municipio,
          valorEmenda: emendas2024,
          valorEmpenhado: emendas2024,
          valorPago: emendas2024, // Considera 2024 já pago
          valorLiquidado: emendas2024,
          autor: 'Paulo Alexandre Barbosa'
        });
      }

      if (emendas2025 > 0) {
        // Para 2025, calcular proporcional de pago/a pagar
        const totalAnterior = emendas2023 + emendas2024;
        const pagoAteAgora = valorPago - totalAnterior;
        const pago2025 = Math.max(0, Math.min(pagoAteAgora, emendas2025));

        emendasParaInserir.push({
          cidadeId: cidade.id,
          anoEmenda: 2025,
          descricao: `Emenda PAB 2025 - Gestor: ${gestor}${obs ? ' - ' + obs : ''}`,
          entidadeBeneficiada: municipio,
          valorEmenda: emendas2025,
          valorEmpenhado: emendas2025,
          valorPago: pago2025,
          valorLiquidado: pago2025,
          autor: 'Paulo Alexandre Barbosa'
        });
      }
    }

    console.log(`\n🔄 Emendas a inserir: ${emendasParaInserir.length}`);
    console.log(`🏙️ Cidades a atualizar: ${cidadesAtualizadas.size}`);

    if (cidadesNaoEncontradas.length > 0) {
      console.log(`\n⚠️ Cidades não encontradas no banco (${cidadesNaoEncontradas.length}):`);
      [...new Set(cidadesNaoEncontradas)].forEach(c => console.log(`   - ${c}`));
    }

    // Deletar emendas existentes das cidades que serão atualizadas
    console.log('\n🗑️ Removendo emendas antigas das cidades atualizadas...');
    const deletadas = await prisma.emenda.deleteMany({
      where: {
        cidadeId: {
          in: [...cidadesAtualizadas]
        }
      }
    });
    console.log(`   Removidas: ${deletadas.count} emendas`);

    // Inserir novas emendas
    console.log('\n📥 Inserindo novas emendas...');
    const resultado = await prisma.emenda.createMany({
      data: emendasParaInserir
    });
    console.log(`   Inseridas: ${resultado.count} emendas`);

    // Resumo final
    console.log('\n✅ Importação concluída!');
    console.log(`   Total de emendas no banco: ${await prisma.emenda.count()}`);

    // Mostrar algumas emendas inseridas
    console.log('\n📋 Amostra das emendas inseridas:');
    const amostra = await prisma.emenda.findMany({
      take: 10,
      orderBy: { id: 'desc' },
      include: { cidade: { select: { nome: true } } }
    });
    amostra.forEach(e => {
      console.log(`   ${e.cidade.nome} (${e.anoEmenda}): R$ ${e.valorEmenda.toLocaleString('pt-BR')}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

importarEmendas();
