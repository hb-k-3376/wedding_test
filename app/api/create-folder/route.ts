import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  const body = await req.json();
  const { accessToken } = body;

  if (!accessToken) return NextResponse.json({ error: 'no token' }, { status: 400 });

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    const folderRes = await drive.files.create({
      requestBody: {
        name: 'wedding_test',
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id, name',
    });

    return NextResponse.json(folderRes.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'ㅎ므..';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
