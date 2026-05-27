// ─────────────────────────────────────────────
//  Real Zero — 전역 TypeScript 타입 정의
// ─────────────────────────────────────────────

/** 친환경 인증 카테고리 */
export type EcoCategory =
  | "텀블러 마스터"
  | "분리수거 컷"
  | "비건 챌린지"
  | "제로 플라스틱"
  | "자전거 출퇴근"
  | "업사이클링"
  | "에너지 절약"
  | "로컬 푸드";

/** 피드 카드 데이터 */
export interface FeedItem {
  id: string;
  userName: string;
  userHandle: string;
  avatarUrl: string;
  category: EcoCategory;
  imageUrl: string;
  caption: string;
  cheerCount: number;
  /** ISO 8601 datetime string */
  createdAt: string;
  /** 현재 유저가 응원 눌렀는지 */
  cheered?: boolean;
}

/** 인증 업로드 폼 데이터 */
export interface UploadFormData {
  userName: string;
  category: EcoCategory;
  caption: string;
  imageFile?: File | null;
}

/** 업로드 모달 컴포넌트 Props */
export interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UploadFormData) => void;
}

/** 피드 카드 컴포넌트 Props */
export interface FeedCardProps {
  item: FeedItem;
  onCheer: (id: string) => void;
}

/** API 응답 래퍼 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}
