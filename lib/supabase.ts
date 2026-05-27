import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
//  Supabase 클라이언트 (싱글턴)
// ─────────────────────────────────────────────

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ─────────────────────────────────────────────
//  DB 타입 정의
// ─────────────────────────────────────────────

export type DbFeedItem = {
  id:          string;
  user_name:   string;
  user_handle: string;
  avatar_url:  string | null;
  category:    string;
  image_url:   string | null;
  caption:     string;
  cheer_count: number;
  created_at:  string;
};
