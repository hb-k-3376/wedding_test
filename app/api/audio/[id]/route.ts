import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: fileId } = await params;
  // 구글 드라이브의 다운로드용 URL로 요청

  const driveRes = await fetch(
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    { method: 'GET' }
  );

  if (!driveRes.ok) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  // 스트림, 타입 전달
  const headers = new Headers(driveRes.headers);
  return new NextResponse(driveRes.body, {
    status: 200,
    headers,
  });
}
