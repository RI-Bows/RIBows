import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

/* eslint-disable import/prefer-default-export */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type || 'application/octet-stream';
    const extFromType = contentType.split('/')[1];
    // fallback to .bin if extension can't be determined
    const ext = extFromType ? extFromType.replace(/[^a-z0-9]/gi, '') : 'bin';

    const filename = `${Date.now()}-${randomUUID()}.${ext}`;
    const publicDir = path.join(process.cwd(), 'public', 'uploads');

    // ensure uploads directory exists
    await fs.mkdir(publicDir, { recursive: true });

    const dest = path.join(publicDir, filename);
    await fs.writeFile(dest, buffer);

    // return public URL (served from /public)
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error('Image upload error', err);
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 500 });
  }
}
