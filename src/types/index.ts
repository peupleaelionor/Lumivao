// ── Types métier LUMIVAO ─────────────────────────────────────────────

export type BusinessTypeKey =
  | "snack"
  | "restaurant"
  | "epicerie"
  | "salon"
  | "onglerie"
  | "telephone"
  | "pressing"
  | "bazar";

export type OfferToneKey = "prudent" | "aggressive" | "premium";

export type OfferGoal = "sell_today" | "destock" | "new_product" | "loyalty";

export type OfferChannel = "whatsapp" | "instagram" | "facebook" | "boutique";

export type OfferStatus = "draft" | "published";

export interface Business {
  id: string;
  ownerId?: string | null;
  name: string;
  slug: string;
  type: BusinessTypeKey;
  logoUrl?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  colors?: { accent?: string } | null;
  openingHours?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description?: string | null;
  category?: string | null;
  price?: number | null;
  oldPrice?: number | null;
  imageUrl?: string | null;
  active: boolean;
  stockQuantity?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  businessId: string;
  productId?: string | null;
  title: string;
  description: string;
  oldPrice?: number | null;
  newPrice?: number | null;
  goal: OfferGoal;
  channel: OfferChannel;
  status: OfferStatus;
  tone: OfferToneKey;
  whatsappMessage: string;
  flyerHeadline: string;
  cta: string;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone?: string | null;
  points: number;
  lastVisitAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyRule {
  id: string;
  businessId: string;
  ruleType: string;
  threshold: number;
  reward: string;
  active: boolean;
  createdAt: string;
}

// ── Conseiller commercial (advisor) ──────────────────────────────────

export type AdvisorObjective =
  | "sell_today"
  | "clear_stock"
  | "increase_basket"
  | "bring_back_customers"
  | "fill_empty_slot"
  | "get_reviews"
  | "build_loyalty";

export type TimeOfDay = "matin" | "midi" | "apres_midi" | "soir";

export type AdviceChannel = "WhatsApp" | "Instagram" | "Boutique" | "TV" | "Google";

/** Une action commerciale concrète recommandée au commerçant. */
export interface AdviceAction {
  type: OfferToneKey;
  goal: string;
  title: string;
  offer: string;
  targetCustomer: string;
  recommendedPrice: string;
  marginAdvice: string;
  bestChannel: AdviceChannel;
  bestTime: string;
  whatsappMessage: string;
  flyerHeadline: string;
  cta: string;
  whyItWorks: string;
}

export interface AdviceDiagnosis {
  summary: string;
  mainOpportunity: string;
  risk: string;
  recommendedFocus: string;
}

export interface AdviceNextStep {
  label: string;
  action: string;
}

export interface AdvisorResponse {
  diagnosis: AdviceDiagnosis;
  actions: AdviceAction[];
  nextSteps: AdviceNextStep[];
  source: "openai" | "local";
}

// ── Moteur d'offres (offer-engine) ───────────────────────────────────
// 3 stratégies fixes : marge protégée / vente rapide / panier premium.

export type EngineStrategy = "marge_protegee" | "vente_rapide" | "panier_premium";

export type EngineBadge = "Recommandée" | "Solide" | "À ajuster";

export interface EngineOffer {
  strategy: EngineStrategy;
  name: string;
  price: string;
  target: string;
  channel: AdviceChannel;
  bestTime: string;
  reason: string;
  marginAdvice: string;
  whatsappMessage: string;
  flyerHeadline: string;
  cta: string;
  /** Score interne 0-100 (jamais étiqueté « IA » côté UI). */
  score: number;
  badge: EngineBadge;
}

export interface ContextAnalysis {
  commercialSituation: string;
  bestAngle: string;
  riskToAvoid: string;
  recommendedStrategy: string;
}

export interface OfferEngineResponse {
  contextAnalysis: ContextAnalysis;
  offers: EngineOffer[];
  /** Rang (1-based) de l'offre recommandée. */
  recommendedOfferRank: number;
  nextAction: { label: string; action: string };
  source: "openai" | "local";
}
