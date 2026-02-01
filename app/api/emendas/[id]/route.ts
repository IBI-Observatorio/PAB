import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    const emenda = await prisma.emenda.findUnique({
      where: { id },
      include: {
        cidade: {
          select: { id: true, nome: true },
        },
      },
    });

    if (!emenda) {
      return NextResponse.json({ error: 'Emenda nao encontrada' }, { status: 404 });
    }

    return NextResponse.json(emenda);
  } catch (error) {
    console.error('Erro ao buscar emenda:', error);
    return NextResponse.json({ error: 'Erro ao buscar emenda' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);
    const body = await request.json();

    const emenda = await prisma.emenda.update({
      where: { id },
      data: {
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

    return NextResponse.json(emenda);
  } catch (error) {
    console.error('Erro ao atualizar emenda:', error);
    return NextResponse.json({ error: 'Erro ao atualizar emenda' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    await prisma.emenda.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Emenda deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar emenda:', error);
    return NextResponse.json({ error: 'Erro ao deletar emenda' }, { status: 500 });
  }
}
