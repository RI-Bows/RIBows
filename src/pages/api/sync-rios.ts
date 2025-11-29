import type { NextApiRequest, NextApiResponse } from 'next';
import Papa from 'papaparse';
import { RioType, upsertRios } from '@/lib/dbActions';

const RIO_CSV_URL: string = 'https://docs.google.com/spreadsheets/d/'
  + '1vK_ixq3a86uXjHXy9oNnyYHwAvyU9smNPKuJU6OYd-Q/'
  + 'export?format=csv'
  + '&id=1vK_ixq3a86uXjHXy9oNnyYHwAvyU9smNPKuJU6OYd-Q'
  + '&gid=1696807341';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const response = await fetch(RIO_CSV_URL);

    if (!response.ok) {
      return res.status(500).json({ error: `Failed to fetch CSV: ${response.status}` });
    }

    const csv = await response.text();

    const result: Papa.ParseResult<any> = Papa.parse<any>(
      csv,
      {
        header: true,
        skipFirstNLines: 4,
        skipEmptyLines: true,
      },
    );

    if (result.errors.length > 0) {
      return res.status(500).json({
        error: 'Failed to parse RIO CSV',
        details: result.errors,
      });
    }

    // Array of objects keyed by column headers
    const rios: RioType[] = result.data.map((r: any) => ({
      name: r['Name of Organization'],
      approvalDate: new Date(Date.parse(r['Date Approved'])),
      expirationDate: new Date(Date.parse(r['Expiration Date'])),
      purposeStatement: r['Statement of Purpose'].trim(),
      interestName: r.Type.trim(),
      mainContact: r['Main Contact Person'].trim(),
      email: r.Email,
      image: null,
    }));
    console.log(rios);

    // Push RIOs into database
    await upsertRios(rios);

    return res.status(200).json({ ok: true, count: rios.length });
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
