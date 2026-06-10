import type { OfferEngineInput } from "@/lib/validators";
import { rulesFor } from "@/data/offer-rules";

// Moteur d'offres — pas de théorie, des offres publiables aujourd'hui.
export const ENGINE_SYSTEM_PROMPT = `Tu es un moteur d'offres commerciales pour petits commerces. Tu ne fais pas de théorie. Tu crées des offres précises, rentables et directement publiables aujourd'hui. Pour chaque situation, propose exactement 3 offres : une qui protège la marge (strategy "marge_protegee"), une qui convertit rapidement (strategy "vente_rapide"), une qui augmente le panier moyen (strategy "panier_premium"). Chaque offre doit contenir un prix, une cible, un canal, un moment, un message WhatsApp court, un titre flyer, un CTA, une raison commerciale et un conseil de marge. Évite les promotions vagues ("-50% sur tout", "offre exceptionnelle" sans prix). Ne casse pas les prix inutilement. Privilégie les packs, lots, menus, offres horaires et bonus. Écris en français, phrases courtes, zéro jargon. Réponds TOUJOURS en JSON strict, sans texte autour.`;

const OBJECTIVE_FR: Record<string, string> = {
  sell_today: "vendre aujourd'hui",
  clear_stock: "écouler du stock",
  increase_basket: "augmenter le panier moyen",
  bring_back_customers: "faire revenir les clients",
  fill_empty_slot: "remplir une heure creuse",
  get_reviews: "obtenir des avis",
  build_loyalty: "fidéliser",
};

const JSON_SHAPE = `Format STRICT :
{
  "contextAnalysis": { "commercialSituation": "", "bestAngle": "", "riskToAvoid": "", "recommendedStrategy": "marge_protegee|vente_rapide|panier_premium" },
  "offers": [
    { "strategy": "marge_protegee", "name": "", "price": "", "target": "", "channel": "WhatsApp|Instagram|Boutique|TV|Google", "bestTime": "", "reason": "", "marginAdvice": "", "whatsappMessage": "", "flyerHeadline": "", "cta": "" },
    { "strategy": "vente_rapide", ... },
    { "strategy": "panier_premium", ... }
  ]
}`;

export function buildEngineUserPrompt(input: OfferEngineInput): string {
  const rules = rulesFor(input.businessType);
  const products =
    input.products && input.products.length > 0
      ? input.products.map((p) => `- ${p.name}${p.price != null ? ` (${p.price} €)` : ""}`).join("\n")
      : "(aucun produit listé)";

  return `Commerce : ${input.businessName}${input.city ? ` — ${input.city}` : ""}
Type : ${input.businessType}
Moment : ${input.timeOfDay ?? "non précisé"}${input.dayOfWeek ? ` (${input.dayOfWeek})` : ""}
Objectif : ${OBJECTIVE_FR[input.objective] ?? input.objective}
Panier moyen : ${input.averageBasket != null ? `${input.averageBasket} €` : "inconnu"}

Situation du commerçant :
"${input.intention || "(rien de précis : propose la meilleure offre du jour)"}"

Produits :
${products}

À privilégier : ${rules.prefer.join(", ")}.
À éviter : ${rules.avoid.join(", ")}.

${JSON_SHAPE}`;
}
