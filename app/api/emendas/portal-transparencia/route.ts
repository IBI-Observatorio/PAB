import { NextResponse } from 'next/server';

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
  valorRestoInscrito?: number;
  valorRestoCancelado?: number;
  valorRestoPago?: number;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ano = searchParams.get('ano') || new Date().getFullYear().toString();
    const pagina = searchParams.get('pagina') || '1';

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

    const params = new URLSearchParams({
      pagina,
      nomeAutor: DEPUTADO_PAULO_ALEXANDRE_BARBOSA,
      ano,
    });

    const response = await fetch(`${PORTAL_TRANSPARENCIA_API_URL}?${params}`, {
      headers: {
        'chave-api-dados': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      if (response.status === 401) {
        return NextResponse.json(
          {
            error: 'Chave da API inválida ou expirada',
            message: 'Verifique sua chave de API do Portal da Transparência'
          },
          { status: 401 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          {
            error: 'Limite de requisições excedido',
            message: 'Aguarde alguns minutos antes de fazer novas requisições'
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: 'Erro ao consultar API do Portal da Transparência', details: errorText },
        { status: response.status }
      );
    }

    const emendas: EmendaPortalTransparencia[] = await response.json();

    // Transformar os dados para o formato esperado pelo frontend
    const emendasFormatadas = emendas.map((emenda) => ({
      codigoEmenda: emenda.codigoEmenda,
      numeroEmenda: emenda.numeroEmenda,
      anoEmenda: emenda.ano,
      tipoEmenda: emenda.tipoEmenda,
      autor: emenda.nomeAutor,
      localidadeGasto: emenda.localidadeDoGasto,
      funcao: emenda.funcao,
      subfuncao: emenda.subfuncao,
      descricao: `${emenda.funcao} - ${emenda.subfuncao}`,
      entidadeBeneficiada: emenda.localidadeDoGasto,
      valorEmenda: emenda.valorEmpenhado + emenda.valorLiquidado + emenda.valorPago,
      valorEmpenhado: emenda.valorEmpenhado,
      valorLiquidado: emenda.valorLiquidado,
      valorPago: emenda.valorPago,
    }));

    return NextResponse.json({
      autor: DEPUTADO_PAULO_ALEXANDRE_BARBOSA,
      ano,
      pagina: parseInt(pagina),
      total: emendasFormatadas.length,
      emendas: emendasFormatadas,
    });
  } catch (error) {
    console.error('Erro ao buscar emendas:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar emendas', details: String(error) },
      { status: 500 }
    );
  }
}
