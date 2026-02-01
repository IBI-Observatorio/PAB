import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();

async function importLiderancas() {
  const filePath = path.join(process.cwd(), 'public', 'arquivos', 'Lideranças Diego (1).xlsx');

  console.log('Lendo arquivo:', filePath);

  const workbook = XLSX.readFile(filePath);

  console.log('\n=== PLANILHAS NO ARQUIVO ===');
  console.log('Abas:', workbook.SheetNames);

  // Buscar cidades existentes
  console.log('\n=== CIDADES NO BANCO ===');
  const cidades = await prisma.cidade.findMany({ select: { id: true, nome: true } });

  console.log('\n=== IMPORTANDO LIDERANÇAS ===');

  for (const sheetName of workbook.SheetNames) {
    console.log(`\n--- Processando: ${sheetName} ---`);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

    let cidadeNome = '';
    let nomeLideranca = '';
    let cargo = '';
    let partido = '';
    let nomeGestor = '';
    let historicoComPAB = '';
    let votos2024 = 0;
    let votosPrevistos2026 = '';
    let dataVisitaGestor: Date | null = null;

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row || row.length === 0) continue;

      const cell0 = String(row[0] || '').trim();
      const cell1 = String(row[1] || '').trim();

      // Linha 1: Cidade (primeira coluna)
      if (i === 1 && cell0) {
        cidadeNome = cell0;
        continue;
      }

      // Linha 2: Nome (formato "Nome: XXXX")
      if (cell0.startsWith('Nome:')) {
        nomeLideranca = cell0.replace('Nome:', '').trim();
        continue;
      }

      // Linha 3: Cargo/Partido + Gestor (formato "Vereador - PL   Gestor: Diego")
      // Ignorar linhas que contenham "Histórico"
      if (cell0.includes('Gestor:') && !cell0.startsWith('Visita') && !cell0.includes('Histórico') && !cell0.includes('histórico')) {
        const gestorMatch = cell0.match(/Gestor:\s*(\w+)/i);
        nomeGestor = gestorMatch ? gestorMatch[1].trim() : '';

        const parts = cell0.split('Gestor:');

        // Parse cargo e partido
        let cargoPartido = parts[0].trim();
        // Remover espaços extras
        cargoPartido = cargoPartido.replace(/\s+/g, ' ').trim();

        // Pode ter formato "Vereador - PL" ou "Vereador: Suplente - PP"
        if (cargoPartido.includes(':')) {
          // "Verador: Suplente - PP" -> cargo = "Vereador Suplente", partido = "PP"
          const colonIdx = cargoPartido.indexOf(':');
          const beforeColon = cargoPartido.substring(0, colonIdx).trim();
          const afterColon = cargoPartido.substring(colonIdx + 1).trim();

          if (afterColon.includes(' - ')) {
            const dashParts = afterColon.split(' - ');
            cargo = beforeColon + ' ' + dashParts[0].trim();
            partido = dashParts[1].trim();
          } else if (afterColon.includes('-')) {
            const dashParts = afterColon.split('-');
            cargo = beforeColon + ' ' + dashParts[0].trim();
            partido = dashParts[1].trim();
          }
        } else if (cargoPartido.includes(' - ')) {
          const dashParts = cargoPartido.split(' - ');
          cargo = dashParts[0].trim();
          partido = dashParts[1].trim();
        } else if (cargoPartido.includes('-')) {
          const dashParts = cargoPartido.split('-');
          cargo = dashParts[0].trim();
          partido = dashParts[1].trim();
        }

        // Corrigir typo comum
        if (cargo.toLowerCase().includes('verador')) {
          cargo = cargo.replace(/verador/gi, 'Vereador');
        }
        continue;
      }

      // Linha 6: Histórico label + Votos 2024 (formato "Histórico com Pab..." + "Votos em 2024: 570")
      if (cell0.includes('Histórico') || cell0.includes('histórico')) {
        // Votos 2024 pode estar na coluna 1 (formato: "Votos em 2024: 570" ou similar)
        if (cell1 && cell1.includes('Votos')) {
          // Pode ser "Votos em 2024: 570" ou "Votos em 2024: 6.064" ou apenas "Votos em 2011:" (sem valor)
          const match = cell1.match(/Votos.*?(\d{1,3}(?:\.\d{3})*|\d+)\s*$/i);
          if (match) {
            const numStr = match[1].replace(/\./g, '');
            votos2024 = parseInt(numStr) || 0;
          }
        }
        continue;
      }

      // Linha 7: Conteúdo do histórico (próxima linha após "Histórico...")
      if (i > 0 && data[i - 1] && String(data[i - 1][0] || '').includes('Histórico') && cell0 && !cell0.includes('Visita')) {
        historicoComPAB = cell0;
        continue;
      }

      // Linha 8: Visita Gestor (formato "Visita Gestor: 23.01.2026")
      if (cell0.includes('Visita') && cell0.includes('Gestor')) {
        const match = cell0.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
        if (match) {
          const day = parseInt(match[1]);
          const month = parseInt(match[2]) - 1;
          const year = parseInt(match[3]);
          dataVisitaGestor = new Date(year, month, day);
        }
        continue;
      }

      // Linha 9: Votos 2026 previstos (formato na coluna 1: "Votos 2026 Pab: 100/150")
      if (cell1 && cell1.includes('Votos 2026')) {
        votosPrevistos2026 = cell1.replace(/Votos\s*2026\s*Pab:/i, '').trim();
        continue;
      }
    }

    console.log('Cidade:', cidadeNome);
    console.log('Nome Liderança:', nomeLideranca);
    console.log('Cargo:', cargo);
    console.log('Partido:', partido);
    console.log('Gestor:', nomeGestor);
    console.log('Histórico:', historicoComPAB.substring(0, 80) + (historicoComPAB.length > 80 ? '...' : ''));
    console.log('Votos 2024:', votos2024);
    console.log('Votos 2026 Previstos:', votosPrevistos2026);
    console.log('Data Visita:', dataVisitaGestor);

    // Buscar cidade no banco
    const cidade = cidades.find(c =>
      c.nome.toLowerCase() === cidadeNome.toLowerCase() ||
      c.nome.toLowerCase().includes(cidadeNome.toLowerCase()) ||
      cidadeNome.toLowerCase().includes(c.nome.toLowerCase())
    );

    if (!cidade) {
      console.log(`⚠️ Cidade "${cidadeNome}" não encontrada no banco!`);
      continue;
    }

    console.log(`✓ Cidade encontrada: ${cidade.nome} (ID: ${cidade.id})`);

    // Verificar se já existe essa liderança
    const existingLideranca = await prisma.lideranca.findFirst({
      where: {
        cidadeId: cidade.id,
        nomeLideranca: nomeLideranca
      }
    });

    if (existingLideranca) {
      console.log(`Atualizando liderança existente...`);

      await prisma.lideranca.update({
        where: { id: existingLideranca.id },
        data: {
          cargo: cargo || existingLideranca.cargo,
          partido: partido || existingLideranca.partido,
          nomeGestor: nomeGestor || existingLideranca.nomeGestor,
          historicoComPAB: historicoComPAB || existingLideranca.historicoComPAB,
          votos2024: votos2024 || existingLideranca.votos2024,
          votosPrevistos2026: votosPrevistos2026 || existingLideranca.votosPrevistos2026,
          dataVisitaGestor: dataVisitaGestor || existingLideranca.dataVisitaGestor
        }
      });
      console.log('✓ Liderança atualizada!');
    } else {
      // Criar nova liderança
      await prisma.lideranca.create({
        data: {
          cidadeId: cidade.id,
          nomeLideranca: nomeLideranca || 'Nome não informado',
          cargo: cargo || 'Não informado',
          partido: partido || 'Não informado',
          nomeGestor: nomeGestor || 'Não informado',
          historicoComPAB: historicoComPAB || 'Não informado',
          votos2024: votos2024,
          votosPrevistos2026: votosPrevistos2026 || null,
          dataVisitaGestor: dataVisitaGestor
        }
      });
      console.log('✓ Liderança criada!');
    }
  }

  console.log('\n=== IMPORTAÇÃO CONCLUÍDA ===');
}

importLiderancas()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
