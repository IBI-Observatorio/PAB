import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cidades = await prisma.cidade.findMany({
      select: {
        id: true,
        nome: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return NextResponse.json(cidades);
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return NextResponse.json({ error: 'Erro ao buscar cidades' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const cidade = await prisma.cidade.create({
      data: {
        nome: body.nome,
        gentilico: body.gentilico,
        dataFundacao: new Date(body.dataFundacao),
        dataAniversario: new Date(body.dataAniversario),
        breveHistorico: body.breveHistorico,
        padroeiro: body.padroeiro,
        pratoTipico: body.pratoTipico,
        fotoPerfil: body.fotoPerfil,
        fotoBackground: body.fotoBackground,
      },
    });

    return NextResponse.json(cidade, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar cidade:', error);
    return NextResponse.json({ error: 'Erro ao criar cidade' }, { status: 500 });
  }
}
