'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { WeddingData } from './types/wedding';

export default function Page() {
  const [data, setData] = useState<WeddingData | null>(null);
  const [token, setToken] = useState<string>('');
  const [folderId, setFolderId] = useState<string>('');

  // 공개 JSON 항상 불러오기
  useEffect(() => {
    fetch('/api/public-json')
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const handleAuth = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
      response_type: 'token',
      scope:
        'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive',
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    const popup = window.open(url, '_blank', 'width=500,height=600');

    const listener = setInterval(() => {
      try {
        const hash = popup?.location.hash;
        if (hash?.includes('access_token')) {
          const t = new URLSearchParams(hash.replace('#', '')).get('access_token');
          setToken(t || '');
          popup?.close();
          clearInterval(listener);
        }
      } catch {}
    }, 500);
  };

  const handleCreateFolder = async () => {
    if (!token) return alert('로그인이 필요합니다.');
    try {
      const res = await fetch('/api/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token }),
      });
      const json = await res.json();
      if (json.id) setFolderId(json.id);
      alert('폴더 생성 완료: ' + json.id);
    } catch (e) {
      console.error(e);
      alert('폴더 생성 실패');
    }
  };

  const handleUploadFile = async () => {
    if (!token || !folderId) return alert('폴더 생성 후 업로드 가능합니다.');
    try {
      const res = await fetch('/api/upload-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token, folderId }),
      });
      const json = await res.json();
      alert('파일 업로드 완료: ' + json.id);
    } catch (e) {
      console.error(e);
      alert('업로드 실패');
    }
  };

  return (
    <div className="p-6">
      <h3 className="font-bold text-lg mb-2">청접장 미리보기</h3>
      {data ? (
        <div className="border p-4 rounded bg-gray-50">
          <p>
            <strong>신랑:</strong> {data.groomName}
          </p>
          <p>
            <strong>신부:</strong> {data.brideName}
          </p>
          <p>
            <strong>날짜:</strong> {data.weddingDate} {data.weddingTime}
          </p>
          <p>
            <strong>장소:</strong> {data.venue.name} ({data.venue.floor})
          </p>
          <p className="mt-2">{data.message}</p>

          <div className="mt-4 flex gap-2">
            {data.images.map((id) => {
              console.log('id', id);
              return (
                <Image
                  key={id}
                  src={`https://drive.google.com/uc?export=view&id=${id}`}
                  alt="wedding"
                  width={150}
                  height={150}
                  className="w-32 h-32 object-cover rounded"
                />
              );
            })}
          </div>
        </div>
      ) : (
        <p>로딩 중...</p>
      )}

      <div className="mt-4 flex gap-2">
        {!token && (
          <button className="cursor-pointer" onClick={handleAuth}>
            Google 인증
          </button>
        )}
        {token && (
          <>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleCreateFolder}
            >
              폴더 생성
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-black rounded"
              onClick={handleUploadFile}
              disabled={!folderId}
            >
              파일 업로드
            </button>
          </>
        )}
      </div>
    </div>
  );
}
