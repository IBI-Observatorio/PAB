const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportarDados() {
  try {
    console.log('📤 Exportando dados do banco...\n');

    // Exportar cidades com todos os relacionamentos
    const cidades = await prisma.cidade.findMany({
      include: {
        dadosDemograficos: true,
        eventosProximos: true,
        dadosVotacao: true,
        deputadosFederais: true,
        emendas: true,
        liderancas: true,
        pautas: true,
      },
    });

    console.log(`✅ Cidades: ${cidades.length}`);

    // Salvar em arquivo JSON
    const outputPath = path.join(__dirname, 'dados-exportados.json');
    fs.writeFileSync(outputPath, JSON.stringify(cidades, null, 2));

    console.log(`\n📁 Dados exportados para: ${outputPath}`);
    console.log(`   Tamanho: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

exportarDados();
