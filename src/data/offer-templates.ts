import type { BusinessTypeKey, GeneratedOffer } from "@/types";

/**
 * Modèles d'offres locaux — utilisés en repli quand OpenAI n'est pas
 * disponible (clé absente, quota, panne réseau). Chaque métier produit
 * 3 tonalités : prudent, agressif, premium.
 *
 * Le but n'est pas d'imiter une IA, mais de garantir qu'un commerçant
 * obtienne TOUJOURS 3 offres propres et publiables, même hors-ligne.
 */

interface ToneCopy {
  titleSuffix: string;
  ctaPrudent: string;
  ctaAggressive: string;
  ctaPremium: string;
}

const CTA_BY_TYPE: Record<BusinessTypeKey, ToneCopy> = {
  snack: { titleSuffix: "du jour", ctaPrudent: "Commander sur WhatsApp", ctaAggressive: "J'en profite maintenant", ctaPremium: "Réserver ma part" },
  restaurant: { titleSuffix: "maison", ctaPrudent: "Réserver une table", ctaAggressive: "Je réserve aujourd'hui", ctaPremium: "Réserver l'expérience" },
  epicerie: { titleSuffix: "du jour", ctaPrudent: "Voir les produits", ctaAggressive: "Je profite de l'offre", ctaPremium: "Commander le panier" },
  salon: { titleSuffix: "beauté", ctaPrudent: "Prendre rendez-vous", ctaAggressive: "Je réserve mon créneau", ctaPremium: "Réserver ma prestation" },
  onglerie: { titleSuffix: "ongles", ctaPrudent: "Prendre rendez-vous", ctaAggressive: "Je réserve aujourd'hui", ctaPremium: "Réserver ma pose" },
  telephone: { titleSuffix: "tech", ctaPrudent: "Demander sur WhatsApp", ctaAggressive: "J'en profite ce soir", ctaPremium: "Réserver le produit" },
  pressing: { titleSuffix: "express", ctaPrudent: "Déposer sur WhatsApp", ctaAggressive: "Je dépose aujourd'hui", ctaPremium: "Réserver le service" },
  bazar: { titleSuffix: "du jour", ctaPrudent: "Voir en boutique", ctaAggressive: "Je profite maintenant", ctaPremium: "Réserver mon lot" },
};

function cleanIntention(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").replace(/^[.,;:!?]+/, "").trim();
}

/** Extrait un prix « 9,90 € » du texte si présent. */
function extractPrice(text: string): string | null {
  const m = text.match(/(\d+[.,]?\d*)\s*€/);
  if (!m) return null;
  return `${m[1]!.replace(".", ",")} €`;
}

/** Titre court à partir de l'intention (avant le prix). */
function shortTitle(intention: string): string {
  const beforePrice = intention.split(/[àa]\s*\d/)[0] ?? intention;
  const t = beforePrice.replace(/\s*[-—]\s*$/, "").trim();
  return t.length > 42 ? `${t.slice(0, 40).trim()}…` : t || "Offre du jour";
}

export function buildLocalOffers(params: {
  businessType: BusinessTypeKey;
  businessName: string;
  intention: string;
  timeOfDay?: string;
}): GeneratedOffer[] {
  const { businessType, businessName, intention } = params;
  const copy = CTA_BY_TYPE[businessType];
  const clean = cleanIntention(intention) || "notre offre du jour";
  const title = shortTitle(clean);
  const price = extractPrice(clean);
  const priceText = price ?? "prix en boutique";
  const moment = params.timeOfDay ? ` (${params.timeOfDay})` : "";

  return [
    {
      type: "prudent",
      title: `${title}`,
      shortText: `${title} — disponible aujourd'hui chez ${businessName}.`,
      whatsappMessage: `Bonjour ! Aujourd'hui chez ${businessName} : ${title}${price ? ` à ${price}` : ""}. C'est dispo maintenant${moment}. Vous voulez que je vous le prépare ?`,
      flyerHeadline: title,
      cta: copy.ctaPrudent,
      suggestedPrice: priceText,
      reason: "Offre claire et sûre : reprend votre proposition telle quelle, sans risque sur la marge.",
    },
    {
      type: "aggressive",
      title: `${title} — aujourd'hui seulement`,
      shortText: `${title}, c'est ${price ?? "une offre"} uniquement aujourd'hui chez ${businessName}. Quantités limitées.`,
      whatsappMessage: `🔥 Offre du jour chez ${businessName} : ${title}${price ? ` à ${price}` : ""}. Uniquement aujourd'hui, jusqu'à épuisement. Je vous en garde un ?`,
      flyerHeadline: `${title}\nAujourd'hui seulement`,
      cta: copy.ctaAggressive,
      suggestedPrice: priceText,
      reason: "Crée l'urgence pour vendre vite ce que vous avez en stock aujourd'hui.",
    },
    {
      type: "premium",
      title: `${title} ${copy.titleSuffix}`,
      shortText: `Notre ${copy.titleSuffix} : ${title}. Préparé avec soin chez ${businessName}.`,
      whatsappMessage: `Bonjour 👋 Chez ${businessName}, on vous propose ${title}${price ? ` à ${price}` : ""}, préparé avec soin. Envie de se faire plaisir aujourd'hui ?`,
      flyerHeadline: `${title}\n${copy.titleSuffix}`,
      cta: copy.ctaPremium,
      suggestedPrice: price ? `${price}` : priceText,
      reason: "Valorise la qualité pour défendre un prix un peu plus élevé et soigner l'image.",
    },
  ];
}
