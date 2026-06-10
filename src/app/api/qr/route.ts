import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { qrInputSchema } from "@/lib/validators";

export const runtime = "nodejs";

const QR_OPTIONS = {
  margin: 1,
  color: { dark: "#121212", light: "#FFFFFF" },
  errorCorrectionLevel: "M" as const,
};

// GET /api/qr?data=...&size=360 → image PNG (utilisable dans <img src>).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const parsed = qrInputSchema.safeParse({
    data: searchParams.get("data") ?? "",
    size: searchParams.get("size") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Paramètres QR invalides." }, { status: 422 });
  }

  const buffer = await QRCode.toBuffer(parsed.data.data, {
    ...QR_OPTIONS,
    width: parsed.data.size,
  });

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}

// POST { data, size } → { dataUrl } pour usage côté client.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const parsed = qrInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Paramètres QR invalides." }, { status: 422 });
  }
  const dataUrl = await QRCode.toDataURL(parsed.data.data, {
    ...QR_OPTIONS,
    width: parsed.data.size,
  });
  return NextResponse.json({ dataUrl });
}
