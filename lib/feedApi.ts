import { supabase, DbFeedItem } from "./supabase";
import { FeedItem, UploadFormData } from "@/types";

// ─────────────────────────────────────────────
//  feedApi — Supabase 데이터 레이어
//  모든 DB / Storage 작업은 여기서만 수행
// ─────────────────────────────────────────────

/** DbFeedItem → FeedItem 변환 */
function toFeedItem(row: DbFeedItem): FeedItem {
  return {
    id:          row.id,
    userName:    row.user_name,
    userHandle:  row.user_handle,
    avatarUrl:   row.avatar_url  ?? `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(row.user_name)}`,
    category:    row.category    as FeedItem["category"],
    imageUrl:    row.image_url   ?? "",
    caption:     row.caption,
    cheerCount:  row.cheer_count,
    createdAt:   row.created_at,
    cheered:     false,
  };
}

/** 피드 목록 조회 (최신순) */
export async function fetchFeedItems(): Promise<FeedItem[]> {
  const { data, error } = await supabase
    .from("feed_items")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return (data as DbFeedItem[]).map(toFeedItem);
}

/** 이미지 → Supabase Storage 업로드 후 공개 URL 반환 */
export async function uploadFeedImage(file: File): Promise<string> {
  const ext  = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("feed-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("feed-images").getPublicUrl(path);
  return data.publicUrl;
}

/** 새 인증 INSERT */
export async function insertFeedItem(
  form: UploadFormData,
  imageUrl: string
): Promise<FeedItem> {
  const handle = `@${form.userName
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9._가-힣]/g, "")}`;

  const { data, error } = await supabase
    .from("feed_items")
    .insert({
      user_name:   form.userName,
      user_handle: handle,
      category:    form.category,
      image_url:   imageUrl || null,
      caption:     form.caption,
      cheer_count: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toFeedItem(data as DbFeedItem);
}

/** 응원수 +1 RPC */
export async function incrementCheer(id: string): Promise<void> {
  const { error } = await supabase.rpc("increment_cheer", { item_id: id });
  if (error) throw new Error(error.message);
}

/** 실시간 신규 인증 구독 */
export function subscribeFeed(onInsert: (item: FeedItem) => void) {
  return supabase
    .channel("feed_items_realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "feed_items" },
      (payload) => {
        onInsert(toFeedItem(payload.new as DbFeedItem));
      }
    )
    .subscribe();
}
