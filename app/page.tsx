"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import FeedList from "@/components/FeedList";
import UploadModal, { FloatingUploadButton } from "@/components/UploadModal";
import { FeedItem, UploadFormData } from "@/types";
import {
  fetchFeedItems,
  incrementCheer,
  subscribeFeed,
  insertFeedItem,
  uploadFeedImage,
} from "@/lib/feedApi";

// ─────────────────────────────────────────────
//  메인 피드 페이지 — Real Zero 홈
//  Supabase 실시간 연동 버전
// ─────────────────────────────────────────────

const FILTER_TAGS = ["전체", "텀블러 마스터", "분리수거 컷", "비건 챌린지", "업사이클링", "자전거 출퇴근"] as const;

export default function HomePage() {
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [feedItems,   setFeedItems]     = useState<FeedItem[]>([]);
  const [isLoading,   setIsLoading]     = useState(true);
  const [error,       setError]         = useState<string | null>(null);
  const [activeTag,   setActiveTag]     = useState<string>("전체");

  // ── 초기 피드 로드
  useEffect(() => {
    fetchFeedItems()
      .then(setFeedItems)
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  // ── 실시간 구독 (신규 인증 수신)
  useEffect(() => {
    const channel = subscribeFeed((newItem) => {
      setFeedItems((prev) => {
        // 내가 올린 글이 이미 있으면 중복 방지
        if (prev.some((p) => p.id === newItem.id)) return prev;
        return [newItem, ...prev];
      });
    });
    return () => { channel.unsubscribe(); };
  }, []);

  // ── 응원하기
  const handleCheer = useCallback(async (id: string) => {
    // 낙관적 업데이트 (즉시 UI 반영)
    setFeedItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cheered: true, cheerCount: item.cheerCount + 1 }
          : item
      )
    );
    try {
      await incrementCheer(id);
    } catch {
      // 실패 시 롤백
      setFeedItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, cheered: false, cheerCount: item.cheerCount - 1 }
            : item
        )
      );
    }
  }, []);

  // ── 인증 업로드
  const handleUploadSubmit = useCallback(async (data: UploadFormData) => {
    let imageUrl = "";
    if (data.imageFile) {
      imageUrl = await uploadFeedImage(data.imageFile);
    }
    const newItem = await insertFeedItem(data, imageUrl);
    // 실시간 구독이 받아오기 전에 낙관적으로 추가
    setFeedItems((prev) =>
      prev.some((p) => p.id === newItem.id) ? prev : [newItem, ...prev]
    );
  }, []);

  // ── 필터링된 피드
  const filteredItems =
    activeTag === "전체"
      ? feedItems
      : feedItems.filter((item) => item.category === activeTag);

  const totalCheers = feedItems.reduce((s, i) => s + i.cheerCount, 0);

  return (
    <>
      <Header />

      <main className="w-full max-w-md mx-auto min-h-screen">

        {/* ── 히어로 배너 ── */}
        <section className="px-4 pt-5 pb-4">
          <div className="relative bg-[#1A3029] border-2 border-[#2C4A3E] overflow-hidden p-4">
            <div aria-hidden="true" className="absolute right-0 top-0 w-32 h-full opacity-10"
              style={{ background: "linear-gradient(135deg, #CCFF00 0%, transparent 70%)" }} />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#CCFF00] bg-[#CCFF00]/10 border border-[#CCFF00]/30 px-2 py-0.5 w-fit">
                  <span className="w-1.5 h-1.5 bg-[#CCFF00] rounded-full animate-pulse" />
                  LIVE
                </span>
                <h1 className="text-[#F4F6F0] text-xl font-black leading-tight mt-1">
                  오늘도 지구를<br />
                  <span className="text-[#CCFF00] lime-glow">힙하게 지켜요</span> 🌿
                </h1>
                <p className="text-[#7A9E8E] text-[11px] font-medium leading-relaxed mt-1">
                  2초 인증으로 친환경 실천을 공유하고<br />함께 응원받아요
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end flex-shrink-0">
                <StatBadge value={isLoading ? "—" : `${feedItems.length}`} label="오늘 인증" />
                <StatBadge value={isLoading ? "—" : totalCheers.toLocaleString("ko-KR")} label="총 응원" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 카테고리 필터 ── */}
        <div className="px-4 pb-1">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {FILTER_TAGS.map((tag) => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className={`flex-shrink-0 px-3 py-1.5 text-[11px] font-black uppercase tracking-wide
                  border-2 transition-all duration-150 whitespace-nowrap
                  ${activeTag === tag
                    ? "bg-[#CCFF00] text-[#0B1914] border-black shadow-[2px_2px_0px_#000]"
                    : "bg-transparent text-[#7A9E8E] border-[#2C4A3E] hover:border-[#CCFF00] hover:text-[#CCFF00]"
                  }`}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── 피드 ── */}
        {isLoading ? (
          <FeedSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => {
            setError(null); setIsLoading(true);
            fetchFeedItems().then(setFeedItems).catch((e) => setError(e.message)).finally(() => setIsLoading(false));
          }} />
        ) : (
          <FeedList items={filteredItems} onCheer={handleCheer} />
        )}
      </main>

      <FloatingUploadButton onClick={() => setIsModalOpen(true)} />

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUploadSubmit}
      />
    </>
  );
}

// ── 서브 컴포넌트 ──

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-end border border-[#2C4A3E] px-2.5 py-1.5 min-w-[70px]">
      <span className="text-[#CCFF00] text-base font-black tabular-nums leading-none">{value}</span>
      <span className="text-[#7A9E8E] text-[9px] font-bold uppercase tracking-wide mt-0.5">{label}</span>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 pt-4 pb-28">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-[#1A3029] border-2 border-[#2C4A3E] animate-pulse">
          <div className="p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-[#2C4A3E]" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 bg-[#2C4A3E] w-24" />
              <div className="h-2 bg-[#2C4A3E] w-16" />
            </div>
          </div>
          <div className="w-full aspect-square bg-[#2C4A3E]" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-3 bg-[#2C4A3E] w-full" />
            <div className="h-3 bg-[#2C4A3E] w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 px-8 text-center">
      <span className="text-4xl">⚠️</span>
      <p className="text-[#F4F6F0] font-black text-base">데이터를 불러오지 못했어요</p>
      <p className="text-[#7A9E8E] text-xs font-mono bg-[#1A3029] px-3 py-2 border border-[#2C4A3E] break-all">
        {message}
      </p>
      <button onClick={onRetry} className="btn-lime px-6 py-2 text-sm">
        다시 시도
      </button>
    </div>
  );
}
