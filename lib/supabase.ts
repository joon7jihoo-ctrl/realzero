import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────
//  Supabase 클라이언트 초기화
//  .env.local에 NEXT_PUBLIC_SUPABASE_URL과
//  NEXT_PUBLIC_SUPABASE_ANON_KEY를 설정하세요.
// ─────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── 추후 사용할 DB 타입 (Supabase CLI로 자동 생성 가능) ───

export type Database = {
  public: {
    Tables: {
      feed_items: {
        Row: {
          id: string;
          user_name: string;
          user_handle: string;
          avatar_url: string | null;
          category: string;
          image_url: string | null;
          caption: string;
          cheer_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_name: string;
          user_handle: string;
          avatar_url?: string | null;
          category: string;
          image_url?: string | null;
          caption: string;
          cheer_count?: number;
          created_at?: string;
        };
        Update: {
          cheer_count?: number;
        };
      };
    };
  };
};
