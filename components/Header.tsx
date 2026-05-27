"use client";

import Link from "next/link";

// ─────────────────────────────────────────────
//  Header — 상단 고정 헤더
//  로고 + 알림 + 마이룸 아이콘
// ─────────────────────────────────────────────

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B1914]/90 backdrop-blur-sm border-b-2 border-[#2C4A3E]">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* ── 로고 ── */}
        <Link href="/" className="group flex items-center gap-2">
          {/* 네온 라임 사각 아이콘 */}
          <div className="w-7 h-7 bg-[#CCFF00] border-2 border-black flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-200">
            <span className="text-[#0B1914] text-xs font-black leading-none">RZ</span>
          </div>
          {/* 브랜드네임 */}
          <div className="flex flex-col leading-none">
            <span className="text-[#CCFF00] text-sm font-black tracking-tight lime-glow">
              REAL ZERO
            </span>
            <span className="text-[#7A9E8E] text-[9px] font-bold tracking-[0.2em] uppercase">
              Hip · Eco · SNS
            </span>
          </div>
        </Link>

        {/* ── 우측 아이콘 그룹 ── */}
        <div className="flex items-center gap-1">
          {/* 알림 버튼 */}
          <button
            aria-label="알림"
            className="relative w-9 h-9 flex items-center justify-center text-[#7A9E8E]
                       hover:text-[#CCFF00] hover:bg-[#1A3029] transition-colors duration-150"
          >
            <BellIcon />
            {/* 읽지 않은 알림 뱃지 */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#CCFF00] rounded-full border border-[#0B1914]" />
          </button>

          {/* 마이룸 버튼 */}
          <Link
            href="/my-room"
            aria-label="마이 룸"
            className="w-9 h-9 flex items-center justify-center text-[#7A9E8E]
                       hover:text-[#CCFF00] hover:bg-[#1A3029] transition-colors duration-150 border-2 border-[#2C4A3E] hover:border-[#CCFF00]"
          >
            <UserIcon />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── 인라인 SVG 아이콘 ──

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
