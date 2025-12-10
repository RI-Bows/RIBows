/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, rioId } = await req.json();

    if (!email || !Number.isInteger(rioId)) {
      return NextResponse.json(
        { error: 'Missing email or rioId' },
        { status: 400 },
      );
    }

    // Get user + their bookmarked rios
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        rios: {
          select: { id: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      );
    }

    console.log('TOGGLE called with', { email, rioId });

    // Check if the rio is already bookmarked
    const alreadyBookmarked = user.rios.some((rio) => rio.id === rioId);

    if (alreadyBookmarked) {
      // Remove bookmark (disconnect)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          rios: {
            disconnect: { id: rioId },
          },
        },
      });

      await prisma.rio.update({
        where: { id: rioId },
        data: {
          bookmarks: {
            decrement: 1,
          },
        },
      });

      return NextResponse.json({ bookmarked: false });
    }

    // Otherwise add bookmark (connect)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        rios: {
          connect: { id: rioId },
        },
      },
    });

    await prisma.rio.update({
      where: { id: rioId },
      data: {
        bookmarks: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ bookmarked: true });
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    return NextResponse.json(
      { error: 'Server Error' },
      { status: 500 },
    );
  }
}
