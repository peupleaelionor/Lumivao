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

/** Une proposition d'offre générée (3 par requête : prudent / aggressive / premium). */
export interface GeneratedOffer {
  type: OfferToneKey;
  title: string;
  shortText: string;
  whatsappMessage: string;
  flyerHeadline: string;
  cta: string;
  suggestedPrice: string;
  reason: string;
}

export interface AiOfferResponse {
  offers: GeneratedOffer[];
  source: "openai" | "local";
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
