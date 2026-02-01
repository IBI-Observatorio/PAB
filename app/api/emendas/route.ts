import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cidadeId = searchParams.get('cidadeId');

    const where = cidadeId ? { cidadeId: parseInt(cidadeId) } : {};

    const emendas = await prisma.emenda.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        cidade: {
          select: { id: true, nome: true },
        },
      },
    });

    return NextResponse.json(emendas);
  } catch (error) {
    console.error('Erro ao buscar emendas:', error);
    return NextResponse.json({ error: 'Erro ao buscar emendas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const emenda = await prisma.emenda.create({
      data: {
        cidadeId: body.cidadeId,
        codigoEmenda: body.codigoEmenda || null,
        numeroEmenda: body.numeroEmenda || null,
        anoEmenda: body.anoEmenda || null,
        tipoEmenda: body.tipoEmenda || null,
        autor: body.autor || null,
        localidadeGasto: body.localidadeGasto || null,
        funcao: body.funcao || null,
        subfuncao: body.subfuncao || null,
        descricao: body.descricao,
        entidadeBeneficiada: body.entidadeBeneficiada,
        valorEmenda: body.valorEmenda || 0,
        valorEmpenhado: body.valorEmpenhado || 0,
        valorLiquidado: body.valorLiquidado || 0,
        valorPago: body.valorPago || 0,
      },
    });

    return NextResponse.json(emenda, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar emenda:', error);
    return NextResponse.json({ error: 'Erro ao criar emenda' }, { status: 500 });
  }
}
