import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    const lideranca = await prisma.lideranca.findUnique({
      where: { id },
      include: {
        cidade: {
          select: { id: true, nome: true },
        },
      },
    });

    if (!lideranca) {
      return NextResponse.json({ error: 'Lideranca nao encontrada' }, { status: 404 });
    }

    return NextResponse.json(lideranca);
  } catch (error) {
    console.error('Erro ao buscar lideranca:', error);
    return NextResponse.json({ error: 'Erro ao buscar lideranca' }, { status: 500 });
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

    const lideranca = await prisma.lideranca.update({
      where: { id },
      data: {
        nomeLideranca: body.nomeLideranca,
        fotoLideranca: body.fotoLideranca || null,
        nomeGestor: body.nomeGestor,
        cargo: body.cargo,
        partido: body.partido,
        historicoComPAB: body.historicoComPAB,
        votos2024: body.votos2024 || 0,
        votosPrevistos2026: body.votosPrevistos2026 || null,
        dataVisitaGestor: body.dataVisitaGestor ? new Date(body.dataVisitaGestor) : null,
      },
    });

    return NextResponse.json(lideranca);
  } catch (error) {
    console.error('Erro ao atualizar lideranca:', error);
    return NextResponse.json({ error: 'Erro ao atualizar lideranca' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    await prisma.lideranca.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Lideranca deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar lideranca:', error);
    return NextResponse.json({ error: 'Erro ao deletar lideranca' }, { status: 500 });
  }
}
