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
      fields: 'id, name, webViewLink',
    });

    const folderId = folderRes.data.id;

    if (!folderId) {
      return NextResponse.json(
        { error: '폴더 ID를 가져올 수 없습니다.' },
        { status: 500 }
      );
    }

    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader', // 읽기 권한
        type: 'anyone', // 누구나 접근 가능
      },
    });

    return NextResponse.json(folderRes.data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '흠..';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
