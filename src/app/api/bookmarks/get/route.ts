/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Missing email' },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        rios: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json([], { status: 200 });
    }
    console.log('FETCH BOOKMARKS called with', { email });

    const rioIds = user.rios.map((r) => r.id);

    return NextResponse.json(rioIds);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Server Error' },
      { status: 500 },
    );
  }
}
