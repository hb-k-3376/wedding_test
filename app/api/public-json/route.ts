import { NextResponse } from 'next/server';

export async function GET() {
  const fileId = process.env.PUBLIC_WEDDING_JSON_ID;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  if (!fileId || !apiKey) {
    return NextResponse.json({ error: 'missing env' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`
    );
    if (!res.ok) throw new Error(`Failed to fetch file: ${res.statusText}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'ㅎ므..';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
