import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  const { accessToken, folderId } = await req.json();
  if (!accessToken || !folderId)
    return NextResponse.json({ error: 'missing data' }, { status: 400 });

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // 샘플 JSON 업로드
    const fileRes = await drive.files.create({
      requestBody: { name: 'wedding-data.json', parents: [folderId] },
      media: {
        mimeType: 'application/json',
        body: JSON.stringify({ test: '테스트 파일' }),
      },
      fields: 'id, name',
    });

    return NextResponse.json(fileRes.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'ㅎ므..';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
