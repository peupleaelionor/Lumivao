import OpenAI from "openai";
import type { OfferEngineInput } from "@/lib/validators";
import type {
  AdviceChannel,
  ContextAnalysis,
  EngineOffer,
  EngineStrategy,
  OfferEngineResponse,
} from "@/types";
import { preciseTemplatesFor, type PreciseOffer } from "@/data/templates/precise-offer-templates";
import { scoreAndRank } from "@/lib/offers/offer-score";
import { ENGINE_SYSTEM_PROMPT, buildEngineUserPrompt } from "./offer-engine-prompt";

// ── Moteur d'offres ──────────────────────────────────────────────────
// 1) valide (en amont, Zod) 2) enrichit (règles métier, dans le prompt)
// 3) OpenAI si clé 4) contrôle JSON 5) score 6) recommande 7) fallback.

const STRATEGIES: EngineStrategy[] = ["marge_protegee", "vente_rapide", "panier_premium"];
const CHANNELS: AdviceChannel[] = ["WhatsApp", "Instagram", "Boutique", "TV", "Google"];
const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v.trim() : fb);

type RawOffer = Omit<EngineOffer, "score" | "badge">;

function waMessage(name: string, businessName: string, offer: string, price: string, intention: string): string {
  const intentNote = intention.trim() ? ` (${intention.trim()})` : "";
  const priceNote = /\d/.test(price) ? ` à ${price}` : "";
  return `Bonjour 👋 Chez ${businessName} : ${name}${priceNote}.${intentNote} ${offer}`;
}

function fromTemplate(t: PreciseOffer, businessName: string, intention: string): RawOffer {
  return {
    strategy: t.strategy,
    name: t.name,
    price: t.price,
    target: t.target,
    channel: t.channel,
    bestTime: t.bestTime,
    reason: t.reason,
    marginAdvice: t.marginAdvice,
    whatsappMessage: waMessage(t.name, businessName, t.cta, t.price, intention),
    flyerHeadline: `${t.name}`,
    cta: t.cta,
  };
}

function buildLocal(input: OfferEngineInput): OfferEngineResponse {
  const templates = preciseTemplatesFor(input.businessType);
  const raw = templates.map((t) => fromTemplate(t, input.businessName, input.intention ?? ""));
  const { offers, recommendedOfferRank } = scoreAndRank(raw);
  return {
    contextAnalysis: {
      commercialSituation: input.intention?.trim()
        ? input.intention.trim()
        : "Meilleures offres du jour pour votre commerce.",
      bestAngle: "Privilégier les packs et offres horaires plutôt que les remises sèches.",
      riskToAvoid: "Une remise trop forte abîme la marge et l'image du produit.",
      recommendedStrategy: STRATEGIES[recommendedOfferRank - 1] ?? "marge_protegee",
    },
    offers,
    recommendedOfferRank,
    nextAction: { label: "Préparer cette offre", action: "prepare_offer" },
    source: "local",
  };
}

function parseOffers(raw: unknown, businessName: string, intention: string): RawOffer[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: RawOffer[] = [];
  for (let i = 0; i < Math.min(raw.length, 3); i++) {
    const o = raw[i] as Record<string, unknown>;
    if (!o || typeof o !== "object") continue;
    const name = str(o.name);
    if (!name) continue;
    const strategy = (STRATEGIES.includes(o.strategy as EngineStrategy)
      ? o.strategy
      : STRATEGIES[i] ?? "marge_protegee") as EngineStrategy;
    const channel = (CHANNELS.includes(o.channel as AdviceChannel)
      ? o.channel
      : "WhatsApp") as AdviceChannel;
    const price = str(o.price);
    out.push({
      strategy,
      name,
      price,
      target: str(o.target, "vos clients"),
      channel,
      bestTime: str(o.bestTime),
      reason: str(o.reason),
      marginAdvice: str(o.marginAdvice),
      whatsappMessage: str(o.whatsappMessage) || waMessage(name, businessName, str(o.cta, "À découvrir"), price, intention),
      flyerHeadline: str(o.flyerHeadline, name),
      cta: str(o.cta, "Préparer cette offre"),
    });
  }
  return out.length > 0 ? out : null;
}

export async function runOfferEngine(input: OfferEngineInput): Promise<OfferEngineResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return buildLocal(input);

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 1100,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ENGINE_SYSTEM_PROMPT },
        { role: "user", content: buildEngineUserPrompt(input) },
      ],
    });

    const text = completion.choices[0]?.message?.content ?? "";
    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      return buildLocal(input);
    }
    const obj = json as Record<string, unknown>;
    const raw = parseOffers(obj.offers, input.businessName, input.intention ?? "");
    if (!raw) return buildLocal(input);

    const { offers, recommendedOfferRank } = scoreAndRank(raw);
    const c = (obj.contextAnalysis ?? {}) as Record<string, unknown>;
    const context: ContextAnalysis = {
      commercialSituation: str(c.commercialSituation, input.intention ?? ""),
      bestAngle: str(c.bestAngle),
      riskToAvoid: str(c.riskToAvoid),
      recommendedStrategy: str(c.recommendedStrategy, offers[recommendedOfferRank - 1]?.strategy ?? "marge_protegee"),
    };
    return {
      contextAnalysis: context,
      offers,
      recommendedOfferRank,
      nextAction: { label: "Préparer cette offre", action: "prepare_offer" },
      source: "openai",
    };
  } catch (err) {
    console.error("[lumivao] runOfferEngine fallback:", err);
    return buildLocal(input);
  }
}
