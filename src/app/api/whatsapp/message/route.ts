import { NextResponse } from "next/server";
import { whatsappInputSchema } from "@/lib/validators";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const runtime = "nodejs";

// POST { phone, message } → { link } (lien wa.me prêt à ouvrir).
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const parsed = whatsappInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Entrée invalide." },
      { status: 422 },
    );
  }
  const link = buildWhatsAppLink(parsed.data.phone, parsed.data.message);
  return NextResponse.json({ link });
}
