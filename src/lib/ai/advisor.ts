import OpenAI from "openai";
import type { AdvisorInput } from "@/lib/validators";
import type {
  AdviceAction,
  AdviceChannel,
  AdviceNextStep,
  AdvisorResponse,
  OfferToneKey,
} from "@/types";
import { buildLocalAdvice } from "@/data/templates/advisor-templates";
import { ADVISOR_SYSTEM_PROMPT, buildAdvisorUserPrompt } from "./advisor-prompt";

// ── Conseiller commercial invisible ──────────────────────────────────
// OpenAI côté serveur, repli local garanti. Ne casse jamais le flux.

const TONES: OfferToneKey[] = ["prudent", "aggressive", "premium"];
const CHANNELS: AdviceChannel[] = ["WhatsApp", "Instagram", "Boutique", "TV", "Google"];

function localFallback(input: AdvisorInput): AdvisorResponse {
  return buildLocalAdvice({
    businessType: input.businessType,
    businessName: input.businessName,
    objective: input.objective,
    intention: input.intention,
  });
}

const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v.trim() : fb);

function parseActions(raw: unknown): AdviceAction[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const out: AdviceAction[] = [];
  for (let i = 0; i < Math.min(raw.length, 3); i++) {
    const a = raw[i] as Record<string, unknown>;
    if (!a || typeof a !== "object") continue;
    const title = str(a.title);
    if (!title) continue;
    const channel = CHANNELS.includes(a.bestChannel as AdviceChannel)
      ? (a.bestChannel as AdviceChannel)
      : "WhatsApp";
    out.push({
      type: (TONES.includes(a.type as OfferToneKey) ? a.type : TONES[i] ?? "prudent") as OfferToneKey,
      goal: str(a.goal),
      title,
      offer: str(a.offer, title),
      targetCustomer: str(a.targetCustomer, "vos clients"),
      recommendedPrice: str(a.recommendedPrice),
      marginAdvice: str(a.marginAdvice),
      bestChannel: channel,
      bestTime: str(a.bestTime),
      whatsappMessage: str(a.whatsappMessage, title),
      flyerHeadline: str(a.flyerHeadline, title),
      cta: str(a.cta, "Partager"),
      whyItWorks: str(a.whyItWorks),
    });
  }
  return out.length > 0 ? out : null;
}

function parseOutput(rawText: string): AdvisorResponse | null {
  let json: unknown;
  try {
    json = JSON.parse(rawText);
  } catch {
    return null;
  }
  const obj = json as Record<string, unknown>;
  const actions = parseActions(obj.actions);
  if (!actions) return null;

  const d = (obj.diagnosis ?? {}) as Record<string, unknown>;
  const steps = Array.isArray(obj.nextSteps)
    ? (obj.nextSteps as Record<string, unknown>[])
        .map((s): AdviceNextStep => ({ label: str(s.label), action: str(s.action) }))
        .filter((s) => s.label)
    : [];

  return {
    diagnosis: {
      summary: str(d.summary),
      mainOpportunity: str(d.mainOpportunity),
      risk: str(d.risk),
      recommendedFocus: str(d.recommendedFocus),
    },
    actions,
    nextSteps: steps,
    source: "openai",
  };
}

export async function generateAdvice(input: AdvisorInput): Promise<AdvisorResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return localFallback(input);

  try {
    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 1100,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: ADVISOR_SYSTEM_PROMPT },
        { role: "user", content: buildAdvisorUserPrompt(input) },
      ],
    });
    const parsed = parseOutput(completion.choices[0]?.message?.content ?? "");
    return parsed ?? localFallback(input);
  } catch (err) {
    console.error("[lumivao] generateAdvice fallback:", err);
    return localFallback(input);
  }
}
