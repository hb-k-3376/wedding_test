import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['drive.google.com'], // 외부 이미지 허용
  },
};

export default nextConfig;
