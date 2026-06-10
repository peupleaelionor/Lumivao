import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── Client Supabase (navigateur) ─────────────────────────────────────
// Renvoie null si non configuré : LUMIVAO fonctionne alors en mode démo
// (localStorage) sans casser. Voir src/lib/store/local-store.ts.

let cached: SupabaseClient | null | undefined;

export function getSupabaseBrowser(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached = url && anon ? createClient(url, anon) : null;
  return cached;
}

export const isSupabaseConfigured = (): boolean =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
