'use client';
import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
}

export const AutoMusic = ({ src }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
    }
  }, []);

  // 볼륨 아이콘 클릭
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true));
    }
  };

  return (
    <div>
      <audio ref={audioRef} src={src} loop />
      <button
        onClick={togglePlay}
        style={{
          fontSize: '24px',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
        }}
        aria-label="볼륨 토글"
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  );
};
