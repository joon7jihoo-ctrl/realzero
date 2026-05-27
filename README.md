# 🌿 Real Zero — 힙 에코 SNS

> Z세대의 친환경 실천을 **2초 인증**으로 공유하는 힙 에코 SNS

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-ready-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com)

---

## 🎨 디자인 콘셉트

| 요소 | 값 |
|---|---|
| 배경 | `#0B1914` (깊은 숲속 다크 그린) |
| 포인트 | `#CCFF00` (네온 라임) |
| 텍스트 | `#F4F6F0` |
| 카드 | `#1A3029` |
| 스타일 | Y2K · 볼드 타이포 · 두꺼운 테두리 · 모바일 퍼스트 |

---

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
# .env.local에 Supabase URL & ANON KEY 입력
```

### 3. 개발 서버 실행

```bash
npm run dev
```

→ [http://localhost:3000](http://localhost:3000) 에서 확인

---

## 📁 프로젝트 구조

```
realzero/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # 메인 피드 페이지
│   └── globals.css         # 글로벌 스타일 + Tailwind
├── components/
│   ├── Header.tsx          # 상단 헤더 (로고 + 마이룸)
│   ├── FeedCard.tsx        # 인증샷 카드
│   ├── FeedList.tsx        # 피드 목록
│   └── UploadModal.tsx     # 업로드 모달 + 플로팅 버튼
├── types/
│   └── index.ts            # TypeScript 타입 정의
├── lib/
│   ├── supabase.ts         # Supabase 클라이언트
│   └── mockData.ts         # 개발용 Mock 데이터
└── .env.local.example      # 환경 변수 템플릿
```

---

## 🔌 Supabase 연동 (추후)

```sql
-- feed_items 테이블
create table feed_items (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  user_handle text not null,
  avatar_url text,
  category text not null,
  image_url text,
  caption text not null,
  cheer_count int default 0,
  created_at timestamptz default now()
);

-- 응원수 증가 RPC
create function increment_cheer(item_id uuid)
returns void language sql as $$
  update feed_items set cheer_count = cheer_count + 1 where id = item_id;
$$;
```

---

## 📌 개발 로드맵

- [x] 메인 피드 페이지
- [x] 인증 카드 컴포넌트
- [x] 업로드 모달 (Mock)
- [ ] Supabase 피드 연동
- [ ] Supabase Storage 이미지 업로드
- [ ] 유저 인증 (Supabase Auth)
- [ ] 마이 룸 페이지
- [ ] 실시간 알림 (Supabase Realtime)
