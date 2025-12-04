/* eslint-disable import/prefer-default-export */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // adjust if your authOptions lives elsewhere
import { prisma } from '@/lib/prisma'; // adjust path if needed

export async function POST(req: Request) {
  console.log('POST /api/rio HIT');
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const data = await req.json();
    const interests: string[] = Array.isArray(data.interests) ? data.interests : [];

    // You only support ONE interest for a Rio, because of your schema
    const interestName = interests[0] ?? null;

    if (!interestName) {
      return NextResponse.json(
        { error: 'Each RIO must have one interest' },
        { status: 400 },
      );
    }

    // 1️⃣ Find or create the interest
    const interest = await prisma.interest.upsert({
      where: { name: interestName },
      update: {},
      create: { name: interestName },
    });

    // 2️⃣ Create the Rio with interestId
    const rio = await prisma.rio.create({
      data: {
        name: data.name,
        purposeStatement: data.purposeStatement,
        mainContact: data.mainContact,
        email: data.email,
        image: data.image ?? null,
        approvalDate: data.approvalDate
          ? new Date(data.approvalDate)
          : new Date(),
        expirationDate: data.expirationDate
          ? new Date(data.expirationDate)
          : new Date('9999-12-31'),

        interestId: interest.id, // THIS is the required field
      },
      include: { interest: true },
    });

    return NextResponse.json(rio, { status: 201 });
  } catch (err) {
    console.error('API /api/rio POST error:', err);
    return NextResponse.json({ error: 'Failed to create RIO' }, { status: 500 });
  }
}
