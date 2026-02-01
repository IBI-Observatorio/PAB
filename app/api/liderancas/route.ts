import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cidadeId = searchParams.get('cidadeId');

    const where = cidadeId ? { cidadeId: parseInt(cidadeId) } : {};

    const liderancas = await prisma.lideranca.findMany({
      where,
      orderBy: { nomeLideranca: 'asc' },
      include: {
        cidade: {
          select: { id: true, nome: true },
        },
      },
    });

    return NextResponse.json(liderancas);
  } catch (error) {
    console.error('Erro ao buscar liderancas:', error);
    return NextResponse.json({ error: 'Erro ao buscar liderancas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const lideranca = await prisma.lideranca.create({
      data: {
        cidadeId: body.cidadeId,
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

    return NextResponse.json(lideranca, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar lideranca:', error);
    return NextResponse.json({ error: 'Erro ao criar lideranca' }, { status: 500 });
  }
}
