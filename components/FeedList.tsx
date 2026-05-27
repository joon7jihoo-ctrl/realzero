"use client";

import { useState } from "react";
import { FeedItem } from "@/types";
import FeedCard from "./FeedCard";

interface FeedListProps {
  initialItems: FeedItem[];
}

// ─────────────────────────────────────────────
//  FeedList — 피드 카드 목록 컨테이너
//  클라이언트 사이드 응원 상태 관리
// ─────────────────────────────────────────────

export default function FeedList({ initialItems }: FeedListProps) {
  const [items, setItems] = useState<FeedItem[]>(initialItems);

  /** 응원하기 핸들러 — cheerCount++ & cheered 플래그 토글 */
  const handleCheer = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, cheered: true, cheerCount: item.cheerCount + 1 }
          : item
      )
    );
    // TODO: Supabase RPC 호출로 교체
    // await supabase.rpc('increment_cheer', { item_id: id })
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-8">
        <span className="text-5xl">🌱</span>
        <p className="text-[#F4F6F0] font-black text-lg">아직 인증이 없어요</p>
        <p className="text-[#7A9E8E] text-sm font-medium leading-relaxed">
          첫 번째 친환경 인증을 올려보세요!<br />
          작은 실천이 세상을 바꿉니다.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {/* 피드 카운트 */}
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="w-1 h-4 bg-[#CCFF00]" />
        <span className="text-[#7A9E8E] text-xs font-bold tracking-wider uppercase">
          오늘의 인증 {items.length}개
        </span>
      </div>

      {/* 카드 리스트 */}
      <div className="flex flex-col gap-3 px-4 pb-28">
        {items.map((item) => (
          <FeedCard key={item.id} item={item} onCheer={handleCheer} />
        ))}

        {/* 더보기 힌트 */}
        <div className="flex items-center justify-center py-6 gap-3">
          <div className="h-px flex-1 bg-[#2C4A3E]" />
          <span className="text-[#3A5A4A] text-xs font-bold tracking-widest uppercase">
            여기까지예요
          </span>
          <div className="h-px flex-1 bg-[#2C4A3E]" />
        </div>
      </div>
    </div>
  );
}
