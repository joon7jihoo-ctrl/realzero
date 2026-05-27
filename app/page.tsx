"use client";

import { useState } from "react";
import Header from "@/components/Header";
import FeedList from "@/components/FeedList";
import UploadModal, { FloatingUploadButton } from "@/components/UploadModal";
import { FeedItem, UploadFormData } from "@/types";
import { MOCK_FEED } from "@/lib/mockData";

// ─────────────────────────────────────────────
//  메인 피드 페이지 — Real Zero 홈
//  모바일 퍼스트 (max-w-md), 중앙 정렬
// ─────────────────────────────────────────────

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(MOCK_FEED);

  /** 인증 업로드 핸들러 (Mock) */
  const handleUploadSubmit = (data: UploadFormData) => {
    const newItem: FeedItem = {
      id: `rz-${Date.now()}`,
      userName: data.userName,
      userHandle: `@${data.userName.toLowerCase().replace(/\s+/g, ".")}`,
      avatarUrl:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
      category: data.category,
      // Mock 이미지: 실제에선 Supabase Storage URL로 교체
      imageUrl:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=480&h=480&fit=crop",
      caption: data.caption,
      cheerCount: 0,
      createdAt: new Date().toISOString(),
      cheered: false,
    };
    // 새 인증을 피드 맨 위에 추가
    setFeedItems((prev) => [newItem, ...prev]);
  };

  return (
    <>
      {/* ── 고정 헤더 ── */}
      <Header />

      {/* ── 메인 컨테이너 — 모바일 퍼스트 중앙 정렬 ── */}
      <main className="w-full max-w-md mx-auto min-h-screen">

        {/* ── 히어로 배너: 오늘의 리얼 제로 ── */}
        <section className="px-4 pt-5 pb-4">
          <div className="relative bg-[#1A3029] border-2 border-[#2C4A3E] overflow-hidden p-4">
            {/* 배경 장식 */}
            <div
              aria-hidden="true"
              className="absolute right-0 top-0 w-32 h-full opacity-10"
              style={{
                background:
                  "linear-gradient(135deg, #CCFF00 0%, transparent 70%)",
              }}
            />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  {/* 라이브 인디케이터 */}
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/30 px-2 py-0.5">
                    <span className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full animate-pulse" />
                    LIVE
                  </span>
                </div>
                <h1 className="text-[#F4F6F0] text-xl font-black leading-tight mt-1">
                  오늘도 지구를<br />
                  <span className="text-[#CCFF00] lime-glow">힙하게 지켜요</span> 🌿
                </h1>
                <p className="text-[#7A9E8E] text-[11px] font-medium leading-relaxed mt-1">
                  2초 인증으로 친환경 실천을 공유하고<br />
                  함께 응원받아요
                </p>
              </div>
              {/* 오른쪽 통계 */}
              <div className="flex flex-col gap-2 items-end flex-shrink-0">
                <StatBadge value={`${feedItems.length}`} label="오늘 인증" />
                <StatBadge
                  value={`${feedItems.reduce((s, i) => s + i.cheerCount, 0).toLocaleString("ko-KR")}`}
                  label="총 응원"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 카테고리 필터 스크롤 ── */}
        <CategoryFilter />

        {/* ── 피드 리스트 ── */}
        <FeedList initialItems={feedItems} />
      </main>

      {/* ── 플로팅 업로드 버튼 ── */}
      <FloatingUploadButton onClick={() => setIsModalOpen(true)} />

      {/* ── 업로드 모달 ── */}
      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUploadSubmit}
      />
    </>
  );
}

// ── 통계 뱃지 ──

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-end border border-[#2C4A3E] px-2.5 py-1.5 min-w-[70px]">
      <span className="text-[#CCFF00] text-base font-black tabular-nums leading-none">
        {value}
      </span>
      <span className="text-[#7A9E8E] text-[9px] font-bold uppercase tracking-wide mt-0.5">
        {label}
      </span>
    </div>
  );
}

// ── 카테고리 필터 바 ──

const FILTER_TAGS = ["전체", "텀블러 마스터", "분리수거 컷", "비건 챌린지", "업사이클링", "자전거 출퇴근"] as const;

function CategoryFilter() {
  const [active, setActive] = useState<string>("전체");

  return (
    <div className="px-4 pb-1">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActive(tag)}
            className={`
              flex-shrink-0 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide
              border-2 transition-all duration-150 whitespace-nowrap
              ${active === tag
                ? "bg-[#CCFF00] text-[#0B1914] border-black shadow-[2px_2px_0px_#000]"
                : "bg-transparent text-[#7A9E8E] border-[#2C4A3E] hover:border-[#CCFF00] hover:text-[#CCFF00]"
              }
            `}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
