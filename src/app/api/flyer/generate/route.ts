import { NextResponse } from "next/server";
import { flyerInputSchema } from "@/lib/validators";

export const runtime = "nodejs";

/**
 * Normalise les données d'un flyer. Le rendu visuel se fait côté client
 * (FlyerPreview + export PNG), donc cette route valide et renvoie un
 * payload propre — utile pour brancher plus tard une génération serveur.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const parsed = flyerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Entrée invalide." },
      { status: 422 },
    );
  }
  const d = parsed.data;
  const qrSrc = d.qrUrl ? `/api/qr?data=${encodeURIComponent(d.qrUrl)}&size=240` : null;
  return NextResponse.json({ flyer: { ...d, qrSrc } });
}
