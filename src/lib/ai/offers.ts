import OpenAI from "openai";
import type { AiOfferInput } from "@/lib/validators";
import type { AiOfferResponse, GeneratedOffer, OfferToneKey } from "@/types";
import { buildLocalOffers } from "@/data/offer-templates";
import { OFFER_SYSTEM_PROMPT, buildOfferUserPrompt } from "./prompt";

// ── Cœur « invisible » de LUMIVAO ────────────────────────────────────
// Tente OpenAI côté serveur. En cas d'absence de clé, d'erreur réseau,
// de quota ou de réponse invalide → repli sur modèles locaux.
// Le flux utilisateur ne casse JAMAIS.

const TONES: OfferToneKey[] = ["prudent", "aggressive", "premium"];

function localFallback(input: AiOfferInput): AiOfferResponse {
  return {
    offers: buildLocalOffers({
      businessType: input.businessType,
      businessName: input.businessName,
      intention: input.intention,
      timeOfDay: input.timeOfDay,
    }),
    source: "local",
  };
}

/** Valide et normalise la sortie du modèle. Renvoie null si inexploitable. */
function parseModelOutput(raw: string): GeneratedOffer[] | null {
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return null;
  }
  const offers = (json as { offers?: unknown })?.offers;
  if (!Array.isArray(offers) || offers.length === 0) return null;

  const normalized: GeneratedOffer[] = [];
  for (let i = 0; i < Math.min(offers.length, 3); i++) {
    const o = offers[i] as Record<string, unknown>;
    if (!o || typeof o !== "object") continue;
    const str = (v: unknown, fb = ""): string =>
      typeof v === "string" ? v.trim() : fb;
    const tone = (TONES.includes(o.type as OfferToneKey)
      ? o.type
      : TONES[i] ?? "prudent") as OfferToneKey;
    const title = str(o.title);
    if (!title) continue;
    normalized.push({
      type: tone,
      title,
      shortText: str(o.shortText, title),
      whatsappMessage: str(o.whatsappMessage, title),
      flyerHeadline: str(o.flyerHeadline, title),
      cta: str(o.cta, "Commander sur WhatsApp"),
      suggestedPrice: str(o.suggestedPrice),
      reason: str(o.reason),
    });
  }
  return normalized.length > 0 ? normalized : null;
}

export async function generateOffers(input: AiOfferInput): Promise<AiOfferResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return localFallback(input);

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 900,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: OFFER_SYSTEM_PROMPT },
        { role: "user", content: buildOfferUserPrompt(input) },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const parsed = parseModelOutput(raw);
    if (!parsed) return localFallback(input);
    return { offers: parsed, source: "openai" };
  } catch (err) {
    // Panne, quota, timeout : on ne casse jamais le flux.
    console.error("[lumivao] generateOffers fallback:", err);
    return localFallback(input);
  }
}
