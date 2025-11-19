import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { prisma } from '@/lib/prisma';

const RIO_CSV_URL: string = `https://docs.google.com/spreadsheets/d/
                            1vK_ixq3a86uXjHXy9oNnyYHwAvyU9smNPKuJU6OYd-Q/
                            export?format=csv
                            &id=1vK_ixq3a86uXjHXy9oNnyYHwAvyU9smNPKuJU6OYd-Q
                            &gid=1696807341`;

type RioRow = {
  name: string;
  approvalData: Date;
  expirationDate: Date;
  purposeStatement: string | null;
  type: string;
  mainContact: string;
  email: string;
  image: string | null;
};

export default async function GET() {
  try {
    const res = await fetch(RIO_CSV_URL);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch CSV: ${res.status}` },
        { status: 500 },
      );
    }

    const csv = await res.text();

    const result: Papa.ParseResult<RioRow> = Papa.parse<RioRow>(
      csv,
      {
        header: true,
        skipFirstNLines: 4,
        skipEmptyLines: true,
      },
    );
    if (result.errors.length > 0) {
      return NextResponse.json(
        { error: 'Failed to parse RIO CSV', details: result.errors },
        { status: 500 },
      );
    }

    // Array of objects keyed by column headers
    const rows: unknown[] = result.data;

    const rios: RioRow[] = rows.map((r: any) => ({
      name: r['Name of Organization'],
      approvalData: new Date(Date.parse(r['Date Approved'])),
      expirationDate: new Date(Date.parse(r['Expiration Date'])),
      purposeStatement: r['Statement of Purpose'].trim(),
      type: r.Type.trim(),
      mainContact: r['Main Contact Person'].trim(),
      email: r.Email,
      image: null,
    }));
    console.log(rios);

    // Push RIOs into database
    await prisma.rio.createMany({ data: rios });

    return NextResponse.json({
      ok: true,
      count: rios.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Unexpected error', details: String(err) },
      { status: 500 },
    );
  }
}
