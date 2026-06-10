import { NextResponse } from "next/server";
import { aiOfferInputSchema } from "@/lib/validators";
import { generateOffers } from "@/lib/ai/offers";

export const runtime = "nodejs";

// Petit garde-fou anti-abus (best-effort, en mémoire process).
const RATE = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = RATE.get(ip);
  if (!entry || now - entry.ts > WINDOW_MS) {
    RATE.set(ip, { count: 1, ts: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez dans quelques instants." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = aiOfferInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Entrée invalide." },
      { status: 422 },
    );
  }

  // generateOffers ne lève jamais : repli local garanti.
  const result = await generateOffers(parsed.data);
  return NextResponse.json(result);
}
