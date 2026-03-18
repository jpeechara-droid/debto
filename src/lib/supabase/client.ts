import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Supabase client for browser/client-side usage.
 * Uses the anon (publishable) key — safe to expose in the browser.
 *
 * Note: Primary data access still goes through Prisma ORM.
 * This client is available for Supabase-specific features like
 * Storage, Realtime, and Edge Functions when needed.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
