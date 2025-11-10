import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiResponse } from 'next';

export const runtime = 'nodejs';

export async function GET(req: NextRequest, res: NextApiResponse) {
  const fileId = req.nextUrl.searchParams.get('id');
  if (!fileId) return res.status(400).json({ error: 'no file id' });

  try {
    const drive = google.drive({ version: 'v3', auth: process.env.GOOGLE_API_KEY });
    const driveResponse = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' }
    );

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    driveResponse.data.pipe(res);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '흠';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
