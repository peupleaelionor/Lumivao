// ── Conseil de marge simple ──────────────────────────────────────────
// Aide le commerçant à ne pas brader. Fonctionne même avec des données
// incomplètes : dans le doute, conseil prudent.

export interface MarginInput {
  costPrice?: number | null; // prix d'achat
  normalPrice?: number | null; // prix normal
  promoPrice?: number | null; // prix promo envisagé
  quantity?: number | null;
}

export type MarginLevel = "good" | "tight" | "low" | "unknown";

export interface MarginAdvice {
  level: MarginLevel;
  /** Marge brute unitaire (si calculable). */
  grossMargin: number | null;
  /** Pourcentage de marge sur le prix de vente. */
  marginPercent: number | null;
  message: string;
  /** Suggestion de pack pour préserver la marge. */
  packSuggestion?: string;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function adviseMargin(input: MarginInput): MarginAdvice {
  const cost = input.costPrice ?? null;
  const price = input.promoPrice ?? input.normalPrice ?? null;

  // Données insuffisantes → conseil prudent, jamais bloquant.
  if (cost == null || price == null || price <= 0) {
    return {
      level: "unknown",
      grossMargin: null,
      marginPercent: null,
      message: "Vérifiez votre prix d'achat avant de baisser trop fortement le prix.",
      packSuggestion: "Pensez à un pack (lot ou + boisson) plutôt qu'une remise sèche.",
    };
  }

  const grossMargin = round2(price - cost);
  const marginPercent = round2((grossMargin / price) * 100);

  if (grossMargin <= 0) {
    return {
      level: "low",
      grossMargin,
      marginPercent,
      message: "À ce prix, vous vendez à perte. Remontez le prix ou proposez un pack.",
      packSuggestion: "Un lot à prix rond protège mieux votre marge qu'une forte remise.",
    };
  }
  if (marginPercent < 20) {
    return {
      level: "tight",
      grossMargin,
      marginPercent,
      message: `Marge serrée (${marginPercent} %). Évitez de baisser davantage.`,
      packSuggestion: "Privilégiez un pack pour augmenter le panier sans casser le prix.",
    };
  }
  return {
    level: "good",
    grossMargin,
    marginPercent,
    message: `Marge correcte (${marginPercent} %). Vous pouvez publier sereinement.`,
  };
}
