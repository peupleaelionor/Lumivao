import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── Client Supabase (serveur) ────────────────────────────────────────
// Utilise la service role key. À n'utiliser QUE côté serveur
// (route handlers, server actions). Jamais exposé au navigateur.

export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
