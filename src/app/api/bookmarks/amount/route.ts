/* eslint-disable import/prefer-default-export */
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const rioId = parseInt(params.id, 10);

  const rio = await prisma.rio.findUnique({
    where: { id: rioId },
    include: {
      interest: {
        select: { name: true },
      },
    },
  });

  if (!rio) {
    return NextResponse.json({ error: 'Rio not found' }, { status: 404 });
  }

  return NextResponse.json(rio.bookmarks);
}
