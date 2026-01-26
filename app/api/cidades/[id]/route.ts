import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    const cidade = await prisma.cidade.findUnique({
      where: { id },
      include: {
        dadosDemograficos: true,
        eventosProximos: {
          orderBy: { dataFeriado: 'asc' },
        },
        dadosVotacao: true,
        deputadosFederais: {
          orderBy: { votos2022: 'desc' },
        },
        emendas: {
          orderBy: { createdAt: 'desc' },
        },
        liderancas: {
          orderBy: { nomeLideranca: 'asc' },
        },
        pautas: {
          orderBy: { dataPublicacao: 'desc' },
        },
      },
    });

    if (!cidade) {
      return NextResponse.json({ error: 'Cidade não encontrada' }, { status: 404 });
    }

    return NextResponse.json(cidade);
  } catch (error) {
    console.error('Erro ao buscar cidade:', error);
    return NextResponse.json({ error: 'Erro ao buscar cidade' }, { status: 500 });
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

    const cidade = await prisma.cidade.update({
      where: { id },
      data: {
        nome: body.nome,
        gentilico: body.gentilico,
        dataFundacao: body.dataFundacao ? new Date(body.dataFundacao) : undefined,
        dataAniversario: body.dataAniversario ? new Date(body.dataAniversario) : undefined,
        breveHistorico: body.breveHistorico,
        padroeiro: body.padroeiro,
        pratoTipico: body.pratoTipico,
        fotoPerfil: body.fotoPerfil,
        fotoBackground: body.fotoBackground,
      },
    });

    return NextResponse.json(cidade);
  } catch (error) {
    console.error('Erro ao atualizar cidade:', error);
    return NextResponse.json({ error: 'Erro ao atualizar cidade' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idString } = await params;
    const id = parseInt(idString);

    await prisma.cidade.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Cidade deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar cidade:', error);
    return NextResponse.json({ error: 'Erro ao deletar cidade' }, { status: 500 });
  }
}
