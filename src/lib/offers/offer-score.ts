import type { EngineBadge, EngineOffer, EngineStrategy } from "@/types";

// ── Moteur de score ──────────────────────────────────────────────────
// Évalue chaque offre sur 100. Jamais affiché comme « score IA » :
// l'UI traduit en badge (Recommandée / Solide / À ajuster).
//
// Critères (max) :
//   clarté 20 · adéquation métier 15 · conversion 20 · marge 15 ·
//   panier moyen 15 · timing 10 · diffusion 5

export interface ScorableOffer {
  strategy: EngineStrategy;
  name: string;
  price: string;
  target: string;
  bestTime: string;
  whatsappMessage: string;
  marginAdvice: string;
}

const hasPrice = (s: string): boolean => /\d/.test(s);

/** Pénalise les promos vagues / destructrices de marge. */
const VAGUE = /(-\s*50\s*%|moiti[ée]|exceptionnelle?|incroyable|venez nombreux)/i;

function clarityScore(o: ScorableOffer): number {
  let s = 20;
  if (!hasPrice(o.price)) s -= 10;
  if (o.name.length > 48) s -= 5;
  if (VAGUE.test(o.name)) s -= 8;
  return Math.max(0, s);
}

function conversionScore(o: ScorableOffer): number {
  let s = 12;
  if (o.strategy === "vente_rapide") s += 6;
  if (/aujourd'hui|ce soir|ce midi|jusqu'à|\dh/i.test(`${o.name} ${o.bestTime}`)) s += 2;
  return Math.min(20, s);
}

function marginScore(o: ScorableOffer): number {
  let s = 10;
  if (o.strategy === "marge_protegee") s += 5;
  if (/pack|lot|menu|duo|bonus|offert/i.test(o.name)) s += 2;
  if (VAGUE.test(o.name)) s -= 6;
  return Math.max(0, Math.min(15, s));
}

function basketScore(o: ScorableOffer): number {
  let s = 8;
  if (o.strategy === "panier_premium") s += 5;
  if (/pack|famille|duo|combo|formule|complet/i.test(o.name)) s += 2;
  return Math.min(15, s);
}

function timingScore(o: ScorableOffer): number {
  return o.bestTime && o.bestTime.trim().length > 0 ? 10 : 6;
}

function diffusionScore(o: ScorableOffer): number {
  return o.whatsappMessage && o.whatsappMessage.length <= 280 ? 5 : 3;
}

/** Score 0-100. */
export function scoreOffer(o: ScorableOffer): number {
  const fit = o.target && o.target.trim().length > 0 ? 15 : 10; // adéquation métier/cible
  const total =
    clarityScore(o) +
    fit +
    conversionScore(o) +
    marginScore(o) +
    basketScore(o) +
    timingScore(o) +
    diffusionScore(o);
  return Math.max(0, Math.min(100, Math.round(total)));
}

export function badgeForScore(score: number): EngineBadge {
  if (score > 85) return "Recommandée";
  if (score >= 70) return "Solide";
  return "À ajuster";
}

export const STRATEGY_LABEL: Record<EngineStrategy, string> = {
  marge_protegee: "Protège votre marge",
  vente_rapide: "Vend vite",
  panier_premium: "Augmente le panier",
};

/** Applique le score + badge, puis renvoie le rang recommandé (1-based). */
export function scoreAndRank(offers: Omit<EngineOffer, "score" | "badge">[]): {
  offers: EngineOffer[];
  recommendedOfferRank: number;
} {
  const scored: EngineOffer[] = offers.map((o) => {
    const score = scoreOffer(o);
    return { ...o, score, badge: badgeForScore(score) };
  });
  let bestIdx = 0;
  for (let i = 1; i < scored.length; i++) {
    if ((scored[i]?.score ?? 0) > (scored[bestIdx]?.score ?? 0)) bestIdx = i;
  }
  return { offers: scored, recommendedOfferRank: bestIdx + 1 };
}
