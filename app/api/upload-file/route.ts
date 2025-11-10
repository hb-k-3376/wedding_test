import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 요청 body에서 액세스 토큰 받기
    const body = await req.json();
    const accessToken = body.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: 'no access token' }, { status: 401 });
    }

    // OAuth2 클라이언트 설정
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    // wedding_test 폴더 찾기
    const folderName = 'wedding_test';
    const searchRes = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id)',
      spaces: 'drive',
    });

    let folderId: string;
    if (searchRes.data.files && searchRes.data.files.length > 0) {
      folderId = searchRes.data.files[0].id!;
    } else {
      // 폴더 없으면 생성
      const folderRes = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id',
      });
      folderId = folderRes.data.id!;
    }

    // 목 데이터 생성
    const mockData = { title: '테스트 데이터' };
    const jsonString = JSON.stringify(mockData);
    const buffer = Buffer.from(jsonString, 'utf-8');
    const stream = Readable.from(buffer);

    // wedding_test 폴더에 파일 생성
    const driveResponse = await drive.files.create({
      requestBody: {
        name: 'wedding-data.json',
        mimeType: 'application/json',
        parents: [folderId], // 폴더 지정
      },
      media: {
        mimeType: 'application/json',
        body: stream,
      },
    });

    console.log('driveResponse', driveResponse.data);
    return NextResponse.json({
      fileId: driveResponse.data.id,
      name: driveResponse.data.name,
      folderId: folderId,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '흠';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
