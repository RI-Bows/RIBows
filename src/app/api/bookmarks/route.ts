import { getBookmarkedRios } from '@/lib/dbActions';
import { NextResponse } from 'next/server';

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  const { email } = await req.json();
  const rios = await getBookmarkedRios(email);

  return NextResponse.json(rios ?? []);
}
