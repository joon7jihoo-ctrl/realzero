-- ================================================
--  Real Zero — Supabase 초기 스키마
--  Supabase 대시보드 SQL Editor에서 전체 실행
-- ================================================

-- 1. feed_items 테이블
create table if not exists public.feed_items (
  id          uuid        default gen_random_uuid() primary key,
  user_name   text        not null,
  user_handle text        not null,
  avatar_url  text,
  category    text        not null,
  image_url   text,
  caption     text        not null,
  cheer_count integer     default 0 not null,
  created_at  timestamptz default now() not null
);

-- 2. 최신순 정렬 인덱스
create index if not exists feed_items_created_at_idx
  on public.feed_items (created_at desc);

-- 3. RLS 활성화
alter table public.feed_items enable row level security;

-- 4. RLS 정책 (MVP: 인증 없이 읽기·쓰기 허용)
drop policy if exists "public_read"   on public.feed_items;
drop policy if exists "public_insert" on public.feed_items;

create policy "public_read"
  on public.feed_items for select using (true);

create policy "public_insert"
  on public.feed_items for insert with check (true);

-- 5. 응원수 증가 RPC (security definer → anon 키로도 호출 가능)
create or replace function public.increment_cheer(item_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.feed_items
  set cheer_count = cheer_count + 1
  where id = item_id;
$$;

-- 6. Storage 버킷 (feed-images, public 5 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'feed-images',
  'feed-images',
  true,
  5242880,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- 7. Storage RLS 정책
drop policy if exists "public_image_read"   on storage.objects;
drop policy if exists "public_image_insert" on storage.objects;

create policy "public_image_read"
  on storage.objects for select
  using (bucket_id = 'feed-images');

create policy "public_image_insert"
  on storage.objects for insert
  with check (bucket_id = 'feed-images');

-- 8. Mock 시드 데이터
insert into public.feed_items (user_name, user_handle, avatar_url, category, image_url, caption, cheer_count)
values
  ('김지환', '@jihwan.eco',
   'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
   '텀블러 마스터',
   'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=480&h=480&fit=crop',
   '오늘도 텀블러 들고 카페 갔다. 직원분이 쿨하다고 칭찬해줬는데 기분 너무 좋음 🌿', 214),

  ('박서연', '@seoyeon.zero',
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
   '분리수거 컷',
   'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=480&h=480&fit=crop',
   '라벨 뜯고 헹구고 납작하게. 분리수거도 결국 루틴이지. ♻️', 87),

  ('이준혁', '@junhyuk.vegan',
   'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop',
   '비건 챌린지',
   'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=480&h=480&fit=crop',
   '일주일 비건 완료 🥦 처음엔 힘들었는데 이제 오히려 몸이 가벼움', 342),

  ('최유나', '@yuna.upcycle',
   'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
   '업사이클링',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=480&h=480&fit=crop',
   '낡은 청바지로 에코백 만들었어요. 세상에 하나뿐인 가방 🎒✨', 128),

  ('정민준', '@minjun.bike',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
   '자전거 출퇴근',
   'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=480&h=480&fit=crop',
   '오늘로 자전거 출퇴근 30일 달성 🚴 탄소 절감량 계산해봤더니 소나무 두 그루분', 456),

  ('한소희', '@sohee.local',
   'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop',
   '로컬 푸드',
   'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=480&h=480&fit=crop',
   '동네 로컬 마켓에서 장 봤어요. 포장재 없이 채소 담아오는 기분 진짜 좋음 🛍️', 93);
