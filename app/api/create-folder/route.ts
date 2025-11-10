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

    const folderName = 'wedding_test';

    // 폴더 존재 여부 확인
    const searchRes = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name, webViewLink)',
      spaces: 'drive',
    });

    let folderData;

    if (searchRes.data.files && searchRes.data.files.length > 0) {
      // 이미 존재하는 폴더 사용
      folderData = searchRes.data.files[0];
    } else {
      // 폴더가 없으면 새로 생성
      const folderRes = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id, name, webViewLink',
      });
      folderData = folderRes.data;
    }

    const folderId = folderData.id;

    if (!folderId) {
      return NextResponse.json(
        { error: '폴더 ID를 가져올 수 없습니다.' },
        { status: 500 }
      );
    }

    // 권한 설정 (이미 설정되어 있어도 에러 안 남)
    await drive.permissions.create({
      fileId: folderId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return NextResponse.json(folderData);
  } catch (e) {
    const msg = e instanceof Error ? e.message : '흠..';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
