import { FeedItem } from "@/types";

/** 개발용 Mock 피드 데이터 */
export const MOCK_FEED: FeedItem[] = [
  {
    id: "rz-001",
    userName: "김지환",
    userHandle: "@jihwan.eco",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
    category: "텀블러 마스터",
    imageUrl:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=480&h=480&fit=crop",
    caption: "오늘도 텀블러 들고 카페 갔다. 직원분이 쿨하다고 칭찬해줬는데 기분 너무 좋음 🌿",
    cheerCount: 214,
    createdAt: "2026-05-27T09:12:00Z",
    cheered: false,
  },
  {
    id: "rz-002",
    userName: "박서연",
    userHandle: "@seoyeon.zero",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    category: "분리수거 컷",
    imageUrl:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=480&h=480&fit=crop",
    caption: "라벨 뜯고 헹구고 납작하게. 분리수거도 결국 루틴이지. ♻️",
    cheerCount: 87,
    createdAt: "2026-05-27T08:45:00Z",
    cheered: true,
  },
  {
    id: "rz-003",
    userName: "이준혁",
    userHandle: "@junhyuk.vegan",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop",
    category: "비건 챌린지",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=480&fit=crop",
    caption: "일주일 비건 완료 🥦 처음엔 힘들었는데 이제 오히려 몸이 가벼움",
    cheerCount: 342,
    createdAt: "2026-05-27T07:30:00Z",
    cheered: false,
  },
  {
    id: "rz-004",
    userName: "최유나",
    userHandle: "@yuna.upcycle",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    category: "업사이클링",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&h=480&fit=crop",
    caption: "낡은 청바지로 에코백 만들었어요. 세상에 하나뿐인 가방 🎒✨",
    cheerCount: 128,
    createdAt: "2026-05-26T22:10:00Z",
    cheered: false,
  },
  {
    id: "rz-005",
    userName: "정민준",
    userHandle: "@minjun.bike",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    category: "자전거 출퇴근",
    imageUrl:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=480&h=480&fit=crop",
    caption: "오늘로 자전거 출퇴근 30일 달성 🚴 탄소 절감량 계산해봤더니 소나무 두 그루분",
    cheerCount: 456,
    createdAt: "2026-05-26T19:55:00Z",
    cheered: true,
  },
  {
    id: "rz-006",
    userName: "한소희",
    userHandle: "@sohee.local",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
    category: "로컬 푸드",
    imageUrl:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=480&h=480&fit=crop",
    caption: "동네 로컬 마켓에서 장 봤어요. 포장재 없이 채소 담아오는 기분 진짜 좋음 🛍️",
    cheerCount: 93,
    createdAt: "2026-05-26T16:20:00Z",
    cheered: false,
  },
];

/** 카테고리 목록 */
export const ECO_CATEGORIES = [
  "텀블러 마스터",
  "분리수거 컷",
  "비건 챌린지",
  "제로 플라스틱",
  "자전거 출퇴근",
  "업사이클링",
  "에너지 절약",
  "로컬 푸드",
] as const;

/** 상대 시간 포맷터 */
export function formatRelativeTime(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHr < 24) return `${diffHr}시간 전`;
  return `${diffDay}일 전`;
}
