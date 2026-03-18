import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Supabase client for server-side usage (API routes, server components).
 * Uses the service role key — NEVER expose in the browser.
 *
 * This client bypasses Row Level Security (RLS) and should only
 * be used in server-side code (API routes, server actions, etc.).
 *
 * Note: Primary data access still goes through Prisma ORM.
 * This client is available for Supabase-specific features like
 * Storage admin operations when needed.
 */
export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
