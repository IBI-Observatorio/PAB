import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

function parseCSVValue(value: string): string {
  // Remove aspas
  return value.replace(/^"|"$/g, '').trim();
}

function parseMoneyValue(value: string): number {
  // Converte "1.320.000,00" para 1320000.00
  const cleaned = value.replace(/^"|"$/g, '').trim();
  if (!cleaned || cleaned === '-' || cleaned === '') return 0;

  // Remove pontos (separador de milhares) e substitui vírgula por ponto
  const normalized = cleaned.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

function extractCityName(localidade: string): string {
  // Extrai o nome da cidade da localidade
  // Ex: "BOFETE - SP" -> "Bofete"
  // Ex: "SÃO PAULO (UF)" -> "São Paulo"
  // Ex: "MÚLTIPLO" -> "Múltiplo"

  let nome = localidade.trim();

  // Remove " - SP" ou similar
  nome = nome.replace(/\s*-\s*SP$/i, '');

  // Remove "(UF)" ou similar
  nome = nome.replace(/\s*\(UF\)$/i, '');

  // Capitaliza corretamente
  nome = nome.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

  return nome;
}

export async function POST() {
  try {

    // Ler o arquivo CSV
    const csvPath = path.join(process.cwd(), 'emendas_pab.csv');

    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { error: 'Arquivo emendas_pab.csv não encontrado na raiz do projeto' },
        { status: 404 }
      );
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    // Pular header
    const dataLines = lines.slice(1);

    const emendasCriadas = [];
    const cidadesCriadas: string[] = [];
    const erros = [];

    // Cache de cidades para evitar múltiplas consultas
    const cidadesCache: Record<string, number> = {};

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const columns = line.split(';').map(parseCSVValue);

      if (columns.length < 18) {
        erros.push({ linha: i + 2, erro: 'Número insuficiente de colunas' });
        continue;
      }

      const [
        ano,
        tipoEmenda,
        autor,
        numeroEmenda,
        _possuiApoiador,
        localidadeGasto,
        funcao,
        subfuncao,
        programaOrcamentario,
        acaoOrcamentaria,
        _planoOrcamentario,
        codigoEmenda,
        valorEmpenhado,
        valorLiquidado,
        valorPago,
        _valorRestosInscritos,
        _valorRestosCancelados,
        _valorRestosPagos,
      ] = columns;

      try {
        // Buscar ou criar a cidade baseada na localidade
        const nomeCidade = extractCityName(localidadeGasto);
        let cidadeId: number;

        if (cidadesCache[nomeCidade]) {
          cidadeId = cidadesCache[nomeCidade];
        } else {
          // Buscar cidade existente
          let cidade = await prisma.cidade.findFirst({
            where: {
              nome: {
                equals: nomeCidade,
              },
            },
          });

          if (!cidade) {
            // Criar nova cidade com dados padrão
            cidade = await prisma.cidade.create({
              data: {
                nome: nomeCidade,
                gentilico: `${nomeCidade.toLowerCase()}ense`,
                dataFundacao: new Date('1900-01-01'),
                dataAniversario: new Date('1900-01-01'),
                breveHistorico: `Cidade de ${nomeCidade} - SP`,
                padroeiro: 'A definir',
                pratoTipico: 'A definir',
              },
            });
            cidadesCriadas.push(nomeCidade);
          }

          cidadeId = cidade.id;
          cidadesCache[nomeCidade] = cidadeId;
        }

        // Verificar se a emenda já existe pelo código
        const emendaExistente = await prisma.emenda.findFirst({
          where: {
            cidadeId,
            codigoEmenda,
          },
        });

        const valorEmp = parseMoneyValue(valorEmpenhado);
        const valorLiq = parseMoneyValue(valorLiquidado);
        const valorPg = parseMoneyValue(valorPago);

        const emendaData = {
          codigoEmenda,
          numeroEmenda,
          anoEmenda: parseInt(ano) || null,
          tipoEmenda,
          autor,
          localidadeGasto,
          funcao,
          subfuncao,
          descricao: `${acaoOrcamentaria} - ${programaOrcamentario}`,
          entidadeBeneficiada: localidadeGasto || 'Não especificado',
          valorEmenda: valorEmp,
          valorEmpenhado: valorEmp,
          valorLiquidado: valorLiq,
          valorPago: valorPg,
        };

        if (emendaExistente) {
          // Atualizar emenda existente
          const emendaAtualizada = await prisma.emenda.update({
            where: { id: emendaExistente.id },
            data: {
              ...emendaData,
              updatedAt: new Date(),
            },
          });
          emendasCriadas.push({ ...emendaAtualizada, cidade: nomeCidade, status: 'atualizada' });
        } else {
          // Criar nova emenda
          const novaEmenda = await prisma.emenda.create({
            data: {
              cidadeId,
              ...emendaData,
            },
          });
          emendasCriadas.push({ ...novaEmenda, cidade: nomeCidade, status: 'criada' });
        }
      } catch (err) {
        erros.push({ linha: i + 2, erro: String(err) });
      }
    }

    // Calcular totais
    const totalEmpenhado = emendasCriadas.reduce((sum, e) => sum + (e.valorEmpenhado || 0), 0);
    const totalPago = emendasCriadas.reduce((sum, e) => sum + (e.valorPago || 0), 0);

    // Agrupar por cidade
    const emendasPorCidade: Record<string, number> = {};
    emendasCriadas.forEach((e) => {
      const cidade = e.cidade || 'Desconhecida';
      emendasPorCidade[cidade] = (emendasPorCidade[cidade] || 0) + 1;
    });

    return NextResponse.json({
      message: 'Importação do CSV concluída',
      totalLinhas: dataLines.length,
      totalImportadas: emendasCriadas.length,
      cidadesCriadas,
      totalCidadesCriadas: cidadesCriadas.length,
      totalErros: erros.length,
      resumo: {
        totalEmpenhado,
        totalPago,
        emendasPorCidade,
      },
      emendas: emendasCriadas,
      erros: erros.length > 0 ? erros : undefined,
    });
  } catch (error) {
    console.error('Erro ao importar CSV:', error);
    return NextResponse.json(
      { error: 'Erro interno ao importar CSV', details: String(error) },
      { status: 500 }
    );
  }
}
