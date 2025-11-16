import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

// eslint-disable-next-line import/prefer-default-export
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
    });
  }

  return NextResponse.json({ authenticated: !!session });
}
