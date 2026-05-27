"use client";

import Image from "next/image";
import { useState } from "react";
import { FeedCardProps } from "@/types";
import { formatRelativeTime } from "@/lib/mockData";

// ─────────────────────────────────────────────
//  FeedCard — 인증샷 피드 카드 컴포넌트
//  Y2K 감성 두꺼운 테두리 + 네온 라임 포인트
// ─────────────────────────────────────────────

export default function FeedCard({ item, onCheer }: FeedCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isCheerAnim, setIsCheerAnim] = useState(false);

  const handleCheer = () => {
    if (item.cheered) return;
    setIsCheerAnim(true);
    onCheer(item.id);
    setTimeout(() => setIsCheerAnim(false), 600);
  };

  return (
    <article
      className="y2k-card overflow-hidden animate-fade-in"
      aria-label={`${item.userName}의 ${item.category} 인증`}
    >
      {/* ── 카드 상단: 유저 정보 + 시간 ── */}
      <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* 아바타 */}
          <div className="relative w-9 h-9 border-2 border-[#CCFF00] overflow-hidden flex-shrink-0">
            <Image
              src={item.avatarUrl}
              alt={item.userName}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
          {/* 이름 + 핸들 */}
          <div className="flex flex-col leading-tight">
            <span className="text-[#F4F6F0] text-sm font-black">{item.userName}</span>
            <span className="text-[#7A9E8E] text-[11px] font-medium">{item.userHandle}</span>
          </div>
        </div>

        {/* 시간 */}
        <span className="text-[10px] font-bold text-[#3A5A4A] tracking-wide">
          {formatRelativeTime(item.createdAt)}
        </span>
      </div>

      {/* ── 카테고리 태그 ── */}
      <div className="px-4 pb-2.5 flex items-center gap-2">
        <span className="eco-tag">{item.category}</span>
        <div className="h-px flex-1 bg-[#2C4A3E]" />
      </div>

      {/* ── 인증 이미지 ── */}
      <div className="relative w-full aspect-square bg-[#0B1914] overflow-hidden">
        {/* 로딩 스켈레톤 */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-[#1A3029] animate-pulse" />
        )}
        <Image
          src={item.imageUrl}
          alt={`${item.userName}의 인증 이미지`}
          fill
          sizes="(max-width: 448px) 100vw, 448px"
          className={`object-cover transition-opacity duration-300 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsImageLoaded(true)}
        />

        {/* 이미지 위 오버레이 뱃지: 인증 시간 */}
        <div className="absolute top-2 right-2 bg-[#0B1914]/80 border border-[#CCFF00] px-2 py-0.5 backdrop-blur-sm">
          <span className="text-[#CCFF00] text-[9px] font-black tracking-widest uppercase">
            ✓ 2초 인증
          </span>
        </div>
      </div>

      {/* ── 한줄평 ── */}
      <div className="px-4 pt-3 pb-1">
        <p className="text-[#F4F6F0] text-sm leading-relaxed font-medium">
          {item.caption}
        </p>
      </div>

      {/* ── 하단 액션 바 ── */}
      <div className="px-4 pt-2.5 pb-3.5 flex items-center justify-between border-t border-[#2C4A3E] mt-2.5">
        {/* 응원하기 버튼 */}
        <button
          onClick={handleCheer}
          disabled={item.cheered}
          aria-label={`응원하기 (${item.cheerCount})`}
          className={`
            flex items-center gap-2 px-4 py-2 text-sm font-black border-2 transition-all duration-150
            ${item.cheered
              ? "bg-[#CCFF00] text-[#0B1914] border-black cursor-default"
              : "bg-transparent text-[#F4F6F0] border-[#2C4A3E] hover:border-[#CCFF00] hover:text-[#CCFF00] hover:shadow-[2px_2px_0px_#CCFF00] active:scale-95"
            }
            ${isCheerAnim ? "scale-110" : "scale-100"}
          `}
        >
          <span
            className={`text-base transition-transform duration-300 ${
              isCheerAnim ? "scale-150" : "scale-100"
            }`}
          >
            🔥
          </span>
          <span>{item.cheered ? "응원 완료!" : "응원하기"}</span>
        </button>

        {/* 응원 카운트 */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#CCFF00] text-sm font-black tabular-nums">
            {item.cheerCount.toLocaleString("ko-KR")}
          </span>
          <span className="text-[#7A9E8E] text-xs font-medium">응원</span>
        </div>
      </div>
    </article>
  );
}
