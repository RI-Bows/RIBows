import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/* eslint-disable import/prefer-default-export */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const body = await req.json();
    const { name, purposeStatement, mainContact, email, interests, image } = body as any;

    // ensure at least one interest exists and get primary id
    let primaryInterestId: number | undefined;
    if (Array.isArray(interests) && interests.length > 0) {
      for (const n of interests) {
        // eslint-disable-next-line no-await-in-loop
        const dbInterest = await prisma.interest.upsert({
          where: { name: String(n) },
          update: {},
          create: { name: String(n) },
        });
        if (!primaryInterestId) primaryInterestId = dbInterest.id;
      }
    }

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (purposeStatement !== undefined) data.purposeStatement = purposeStatement;
    if (mainContact !== undefined) data.mainContact = mainContact;
    if (email !== undefined) data.email = email;
    if (image !== undefined) data.image = image;
    if (primaryInterestId !== undefined) data.interest = { connect: { id: primaryInterestId } };

    const updated = await prisma.rio.update({
      where: { id },
      data,
      include: { interest: true },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error('RIO update error', err);
    return NextResponse.json({ error: err.message ?? 'Unknown' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing id' }), { status: 400 });
    }

    await prisma.rio.delete({
      where: { id: Number(id) },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Delete failed' }), { status: 500 });
  }
}
