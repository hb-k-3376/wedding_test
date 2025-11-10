import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: fileId } = await params;
  console.log('Requested file ID:', fileId); // 로그 추가

  const driveRes = await fetch(
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    { method: 'GET' }
  );

  console.log('Drive response status:', driveRes.status); // 로그 추가
  console.log('Content-Type:', driveRes.headers.get('content-type')); // 로그 추가

  if (!driveRes.ok) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  const headers = new Headers(driveRes.headers);
  return new NextResponse(driveRes.body, {
    status: 200,
    headers,
  });
}
