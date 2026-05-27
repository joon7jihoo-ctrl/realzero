"use client";

import { useState, useRef, FormEvent, useCallback, useEffect } from "react";
import Image from "next/image";
import { UploadModalProps, UploadFormData, EcoCategory } from "@/types";
import { ECO_CATEGORIES } from "@/lib/mockData";

// ─────────────────────────────────────────────
//  UploadModal — 플로팅 버튼 + 인증 업로드 모달
//  (현재는 클라이언트 사이드 mock 동작)
// ─────────────────────────────────────────────

const INITIAL_FORM: UploadFormData = {
  userName: "",
  category: "텀블러 마스터",
  caption: "",
  imageFile: null,
};

export default function UploadModal({ isOpen, onClose, onSubmit }: UploadModalProps) {
  const [form, setForm] = useState<UploadFormData>(INITIAL_FORM);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setForm((prev) => ({ ...prev, imageFile: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageFile(file);
    },
    [handleImageFile]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.userName.trim() || !form.caption.trim()) return;

    setIsLoading(true);
    try {
      // Mock: 실제 Supabase 업로드로 교체할 부분
      await new Promise((resolve) => setTimeout(resolve, 1200));
      onSubmit(form);
      setForm(INITIAL_FORM);
      setPreview(null);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;
    setForm(INITIAL_FORM);
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ── 배경 오버레이 ── */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* ── 모달 패널 ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="친환경 인증 업로드"
        className="fixed inset-x-0 bottom-0 z-50 max-w-md mx-auto animate-slide-up"
      >
        <div className="bg-[#0B1914] border-t-2 border-x-2 border-[#CCFF00] shadow-[0_-8px_40px_rgba(204,255,0,0.15)]">
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#2C4A3E]">
            <div>
              <h2 className="text-[#CCFF00] text-lg font-black tracking-tight lime-glow">
                🌿 인증 올리기
              </h2>
              <p className="text-[#7A9E8E] text-[11px] font-medium mt-0.5">
                나의 친환경 실천을 공유해봐요
              </p>
            </div>
            <button
              onClick={handleClose}
              aria-label="닫기"
              className="w-8 h-8 flex items-center justify-center border-2 border-[#2C4A3E] text-[#7A9E8E]
                         hover:border-[#CCFF00] hover:text-[#CCFF00] transition-colors duration-150"
            >
              <XIcon />
            </button>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="px-5 pt-4 pb-6 flex flex-col gap-4">
            {/* 이미지 드롭존 */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative w-full aspect-video overflow-hidden cursor-pointer
                border-2 border-dashed transition-all duration-150
                flex items-center justify-center flex-col gap-2
                ${isDragging
                  ? "border-[#CCFF00] bg-[#CCFF00]/10"
                  : preview
                  ? "border-[#CCFF00]"
                  : "border-[#2C4A3E] bg-[#1A3029] hover:border-[#CCFF00]/50"
                }
              `}
            >
              {preview ? (
                <Image src={preview} alt="미리보기" fill className="object-cover" />
              ) : (
                <>
                  <span className="text-3xl">📸</span>
                  <p className="text-[#7A9E8E] text-xs font-bold text-center">
                    인증 사진을 선택하거나<br />여기에 끌어다 놓으세요
                  </p>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#3A5A4A]">
                    JPG · PNG · WEBP
                  </span>
                </>
              )}
              {/* 오버레이 변경 버튼 */}
              {preview && (
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[#CCFF00] text-xs font-black border border-[#CCFF00] px-3 py-1">
                    사진 변경
                  </span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* 유저 이름 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#7A9E8E] text-[11px] font-black uppercase tracking-widest">
                닉네임
              </label>
              <input
                type="text"
                value={form.userName}
                onChange={(e) => setForm((p) => ({ ...p, userName: e.target.value }))}
                placeholder="ex) 지구지킴이_지환"
                maxLength={20}
                required
                className="eco-input"
              />
            </div>

            {/* 카테고리 선택 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#7A9E8E] text-[11px] font-black uppercase tracking-widest">
                친환경 카테고리
              </label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value as EcoCategory }))
                  }
                  required
                  className="eco-select pr-10"
                >
                  {ECO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {/* 셀렉트 화살표 */}
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#CCFF00]">
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            {/* 한줄 소감 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#7A9E8E] text-[11px] font-black uppercase tracking-widest flex justify-between">
                <span>한줄 소감</span>
                <span className={form.caption.length > 70 ? "text-[#CCFF00]" : "text-[#3A5A4A]"}>
                  {form.caption.length}/80
                </span>
              </label>
              <textarea
                value={form.caption}
                onChange={(e) => setForm((p) => ({ ...p, caption: e.target.value }))}
                placeholder="오늘의 친환경 실천을 한 줄로 표현해봐요 🌿"
                maxLength={80}
                required
                rows={3}
                className="eco-input resize-none"
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={isLoading || !form.userName.trim() || !form.caption.trim()}
              className={`
                w-full py-3.5 text-sm font-black border-2 tracking-wide uppercase
                transition-all duration-150 active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
                ${isLoading
                  ? "bg-[#CCFF00]/30 text-[#CCFF00] border-[#CCFF00]"
                  : "btn-lime"
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  인증 올리는 중...
                </span>
              ) : (
                "🚀 인증 올리기"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

// ── 플로팅 버튼 (별도 export) ──

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingUploadButton({ onClick }: FloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="인증 업로드"
      className="
        fixed bottom-6 right-1/2 translate-x-[calc(50%_+_120px)] z-40
        w-14 h-14 bg-[#CCFF00] border-2 border-black
        flex items-center justify-center
        shadow-[4px_4px_0px_#000000]
        hover:shadow-[6px_6px_0px_#000000] hover:-translate-y-0.5
        hover:translate-x-[calc(50%_+_119px)]
        active:shadow-[2px_2px_0px_#000000] active:translate-y-0.5
        transition-all duration-150
        animate-pulse-lime
        max-md:right-6 max-md:translate-x-0 max-md:hover:translate-x-0
      "
    >
      <PlusIcon />
    </button>
  );
}

// ── 인라인 SVG 아이콘 ──

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0B1914" strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
