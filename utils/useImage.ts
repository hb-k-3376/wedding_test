import { useEffect, useRef, useState } from 'react';

// 간단 캐시 저장
const imageCache = new Map<string, HTMLImageElement>();

export function useImage(src?: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!src) return;

    // 이미 캐싱되어 있으면 바로 반환
    if (imageCache.has(src)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setImg(imageCache.get(src)!);
      return;
    }

    const image = new window.Image();
    image.crossOrigin = 'anonymous'; // CDN / S3용 권장
    image.src = src;

    image.onload = () => {
      if (!isMounted.current) return;
      imageCache.set(src, image);
      setImg(image);
    };

    image.onerror = () => {
      if (!isMounted.current) return;
      setImg(null); // 오류 처리
    };
  }, [src]);

  return img;
}
