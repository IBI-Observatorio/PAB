import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PORTAL_TRANSPARENCIA_API_URL = 'https://api.portaldatransparencia.gov.br/api-de-dados/emendas';
const DEPUTADO_PAULO_ALEXANDRE_BARBOSA = 'PAULO ALEXANDRE PEREIRA BARBOSA';

interface EmendaPortalTransparencia {
  codigoEmenda: string;
  numeroEmenda: string;
  ano: number;
  tipoEmenda: string;
  nomeAutor: string;
  localidadeDoGasto: string;
  funcao: string;
  subfuncao: string;
  valorEmpenhado: number;
  valorLiquidado: number;
  valorPago: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cidadeId, ano, filtroLocalidade } = body;

    if (!cidadeId) {
      return NextResponse.json(
        { error: 'cidadeId é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se a cidade existe
    const cidade = await prisma.cidade.findUnique({
      where: { id: cidadeId },
    });

    if (!cidade) {
      return NextResponse.json(
        { error: 'Cidade não encontrada' },
        { status: 404 }
      );
    }

    const apiKey = process.env.PORTAL_TRANSPARENCIA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Chave da API do Portal da Transparência não configurada',
          message: 'Configure a variável PORTAL_TRANSPARENCIA_API_KEY no arquivo .env',
          instrucoes: 'Obtenha sua chave em: https://portaldatransparencia.gov.br/api-de-dados/cadastrar-email'
        },
        { status: 500 }
      );
    }

    const anoConsulta = ano || new Date().getFullYear();
    let todasEmendas: EmendaPortalTransparencia[] = [];
    let pagina = 1;
    let temMaisResultados = true;

    // Buscar todas as páginas de resultados
    while (temMaisResultados) {
      const params = new URLSearchParams({
        pagina: pagina.toString(),
        nomeAutor: DEPUTADO_PAULO_ALEXANDRE_BARBOSA,
        ano: anoConsulta.toString(),
      });

      const response = await fetch(`${PORTAL_TRANSPARENCIA_API_URL}?${params}`, {
        headers: {
          'chave-api-dados': apiKey,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json(
            { error: 'Chave da API inválida ou expirada' },
            { status: 401 }
          );
        }
        break;
      }

      const emendas: EmendaPortalTransparencia[] = await response.json();

      if (emendas.length === 0) {
        temMaisResultados = false;
      } else {
        todasEmendas = [...todasEmendas, ...emendas];
        pagina++;

        // Limite de segurança para evitar loop infinito
        if (pagina > 100) {
          temMaisResultados = false;
        }
      }
    }

    // Filtrar por localidade se especificado
    let emendasFiltradas = todasEmendas;
    if (filtroLocalidade) {
      emendasFiltradas = todasEmendas.filter((emenda) =>
        emenda.localidadeDoGasto?.toLowerCase().includes(filtroLocalidade.toLowerCase())
      );
    }

    // Importar emendas para o banco de dados
    const emendasCriadas = [];
    for (const emenda of emendasFiltradas) {
      // Verificar se a emenda já existe pelo código
      const emendaExistente = await prisma.emenda.findFirst({
        where: {
          cidadeId,
          codigoEmenda: emenda.codigoEmenda,
        },
      });

      if (emendaExistente) {
        // Atualizar emenda existente
        const emendaAtualizada = await prisma.emenda.update({
          where: { id: emendaExistente.id },
          data: {
            valorEmpenhado: emenda.valorEmpenhado,
            valorLiquidado: emenda.valorLiquidado,
            valorPago: emenda.valorPago,
            updatedAt: new Date(),
          },
        });
        emendasCriadas.push({ ...emendaAtualizada, status: 'atualizada' });
      } else {
        // Criar nova emenda
        const novaEmenda = await prisma.emenda.create({
          data: {
            cidadeId,
            codigoEmenda: emenda.codigoEmenda,
            numeroEmenda: emenda.numeroEmenda,
            anoEmenda: emenda.ano,
            tipoEmenda: emenda.tipoEmenda,
            autor: emenda.nomeAutor,
            localidadeGasto: emenda.localidadeDoGasto,
            funcao: emenda.funcao,
            subfuncao: emenda.subfuncao,
            descricao: `${emenda.funcao} - ${emenda.subfuncao}`,
            entidadeBeneficiada: emenda.localidadeDoGasto || 'Não especificado',
            valorEmenda: emenda.valorEmpenhado + emenda.valorLiquidado + emenda.valorPago,
            valorEmpenhado: emenda.valorEmpenhado,
            valorLiquidado: emenda.valorLiquidado,
            valorPago: emenda.valorPago,
          },
        });
        emendasCriadas.push({ ...novaEmenda, status: 'criada' });
      }
    }

    return NextResponse.json({
      message: 'Importação concluída',
      autor: DEPUTADO_PAULO_ALEXANDRE_BARBOSA,
      ano: anoConsulta,
      cidade: cidade.nome,
      totalEncontradas: todasEmendas.length,
      totalFiltradas: emendasFiltradas.length,
      totalImportadas: emendasCriadas.length,
      emendas: emendasCriadas,
    });
  } catch (error) {
    console.error('Erro ao importar emendas:', error);
    return NextResponse.json(
      { error: 'Erro interno ao importar emendas', details: String(error) },
      { status: 500 }
    );
  }
}
