import type { BusinessTypeKey } from "@/types";

// ── Règles commerciales par métier ───────────────────────────────────
// Servent à enrichir le prompt du moteur ET à cadrer le fallback local.
// Objectif : privilégier packs/lots/menus/horaires, éviter les remises sèches.

export interface OfferRules {
  prefer: string[];
  avoid: string[];
  /** Angles selon le moment de la journée. */
  byTime?: Partial<Record<"matin" | "midi" | "apres_midi" | "soir", string>>;
}

export const OFFER_RULES: Record<BusinessTypeKey, OfferRules> = {
  snack: {
    prefer: ["menu + boisson", "pack famille", "bonus boisson", "horaire midi"],
    avoid: ["remise unitaire trop basse", "promo sans prix"],
    byTime: { midi: "menu simple et rapide", soir: "duo ou pack famille" },
  },
  restaurant: {
    prefer: ["formule midi", "menu découverte", "spécialité limitée"],
    avoid: ["remise sur le plat principal", "offre vague"],
    byTime: { midi: "formule entrée + plat", soir: "spécialité maison limitée" },
  },
  epicerie: {
    prefer: ["lot de 3 ou 6", "panier week-end", "offre fin de journée"],
    avoid: ["remise à l'unité si lot possible", "-50 % sur tout"],
    byTime: { apres_midi: "offre fin de journée sur le frais" },
  },
  salon: {
    prefer: ["offre horaire créneau calme", "pack soin", "finition offerte"],
    avoid: ["brader la prestation", "remise permanente"],
    byTime: { apres_midi: "créneau libre cet après-midi" },
  },
  onglerie: {
    prefer: ["offre duo", "pose + finition", "fidélité retouche offerte"],
    avoid: ["remise forte sur la pose", "promo floue"],
    byTime: { apres_midi: "créneau libre semaine" },
  },
  telephone: {
    prefer: ["coque + protection", "chargeur + câble", "réparation + accessoire"],
    avoid: ["remise sèche sur le téléphone", "promo sans détail"],
  },
  pressing: {
    prefer: ["lot de chemises", "forfait 5 pièces", "offre famille"],
    avoid: ["remise à la pièce", "offre sans délai"],
  },
  bazar: {
    prefer: ["lot à prix rond", "nouveauté du jour", "prix flash horaire"],
    avoid: ["déstockage total non ciblé", "promo vague"],
  },
};

export function rulesFor(type: BusinessTypeKey): OfferRules {
  return OFFER_RULES[type] ?? OFFER_RULES.snack;
}
