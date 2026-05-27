/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages 정적 배포
  output: "export",
  // 레포 이름이 서브경로 (/realzero)
  basePath: "/realzero",
  trailingSlash: true,
  images: {
    // GitHub Pages는 Next.js 이미지 최적화 서버 없음 → unoptimized
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
