import type { Metadata, Viewport } from "next";
import "./globals.css";

// ─────────────────────────────────────────────
//  루트 레이아웃 — 전체 앱 틀
//  다크 그린 배경, 모바일 퍼스트
//  Geist 폰트 파일이 있을 경우 app/fonts/ 에
//  GeistVF.woff / GeistMonoVF.woff를 추가하세요.
// ─────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Real Zero — 힙 에코 SNS",
  description: "Z세대의 친환경 실천을 2초 인증으로 공유하는 힙 에코 SNS",
  keywords: ["친환경", "에코", "제로웨이스트", "SNS", "Z세대"],
  authors: [{ name: "Real Zero Team" }],
  openGraph: {
    title: "Real Zero",
    description: "힙하게, 친환경하게 🌿",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0B1914",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body
        className="min-h-full bg-[#0B1914] text-[#F4F6F0] antialiased"
      >
        {/* 배경 그라디언트 장식 */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(204,255,0,0.06) 0%, transparent 60%)",
          }}
        />
        {/* 메인 콘텐츠 */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
