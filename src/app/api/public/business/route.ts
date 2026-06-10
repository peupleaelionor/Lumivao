import { NextResponse } from "next/server";
import { publicBusinessQuerySchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET /api/public/business?slug=chez-awa
 * Renvoie les données PUBLIQUES d'un commerce (nom, offre du jour,
 * produits actifs). Aucune donnée privée n'est exposée.
 *
 * En mode démo (sans Supabase), la mini-vitrine est rendue côté client
 * depuis le magasin local ; cette route sert le chemin production.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = publicBusinessQuerySchema.safeParse({ slug: searchParams.get("slug") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ error: "Slug invalide." }, { status: 422 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Base de données non configurée (mode démo).", demo: true },
      { status: 503 },
    );
  }

  const { slug } = parsed.data;
  const { data: business, error } = await supabase
    .from("businesses")
    .select("id, name, slug, type, logo_url, city, address, whatsapp, phone, opening_hours")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !business) {
    return NextResponse.json({ error: "Commerce introuvable." }, { status: 404 });
  }

  const [{ data: products }, { data: offers }] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, price, category")
      .eq("business_id", business.id)
      .eq("active", true)
      .limit(12),
    supabase
      .from("offers")
      .select("id, title, description, new_price, whatsapp_message")
      .eq("business_id", business.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  return NextResponse.json({
    business,
    products: products ?? [],
    offer: offers?.[0] ?? null,
  });
}
