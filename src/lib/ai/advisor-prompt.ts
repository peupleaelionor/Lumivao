import type { AdvisorInput } from "@/lib/validators";

// Conseiller commercial terrain — ne parle jamais comme une IA.
export const ADVISOR_SYSTEM_PROMPT = `Tu es un conseiller commercial terrain pour petits commerces. Tu aides un commerçant à vendre aujourd'hui avec des actions simples, concrètes et rentables. Tu ne parles jamais comme une IA. Tu ne fais pas de théorie. Tu proposes des décisions pratiques : quoi vendre, à qui, à quel prix, par quel canal, à quel moment et avec quel message. Tu protèges la marge, tu évites les promotions inutiles, tu aides à écouler le stock, faire revenir les clients et augmenter le panier moyen. Tu écris en français, phrases courtes, zéro jargon. Réponds TOUJOURS en JSON strict, clair et directement exploitable, sans texte autour.`;

const OBJECTIVE_FR: Record<string, string> = {
  sell_today: "vendre aujourd'hui",
  clear_stock: "écouler du stock",
  increase_basket: "augmenter le panier moyen",
  bring_back_customers: "faire revenir les clients",
  fill_empty_slot: "remplir une heure creuse",
  get_reviews: "obtenir des avis Google",
  build_loyalty: "fidéliser les clients",
};

const JSON_SHAPE = `Format de sortie STRICT :
{
  "diagnosis": { "summary": "", "mainOpportunity": "", "risk": "", "recommendedFocus": "" },
  "actions": [
    { "type": "prudent", "goal": "", "title": "", "offer": "", "targetCustomer": "", "recommendedPrice": "", "marginAdvice": "", "bestChannel": "WhatsApp|Instagram|Boutique|TV|Google", "bestTime": "", "whatsappMessage": "", "flyerHeadline": "", "cta": "", "whyItWorks": "" },
    { "type": "aggressive", ... },
    { "type": "premium", ... }
  ],
  "nextSteps": [ { "label": "", "action": "" } ]
}`;

export function buildAdvisorUserPrompt(input: AdvisorInput): string {
  const products =
    input.products && input.products.length > 0
      ? input.products.map((p) => `- ${p.name}${p.price != null ? ` (${p.price} €)` : ""}`).join("\n")
      : "(aucun produit listé)";

  return `Commerce : ${input.businessName}${input.city ? ` — ${input.city}` : ""}
Type : ${input.businessType}
Moment : ${input.timeOfDay ?? "non précisé"}${input.dayOfWeek ? ` (${input.dayOfWeek})` : ""}
Nombre de clients connus : ${input.customersCount ?? 0}
Objectif principal : ${OBJECTIVE_FR[input.objective] ?? input.objective}

Situation décrite par le commerçant :
"${input.intention || "(rien de précis, propose la meilleure action du jour)"}"

Produits :
${products}

Donne un diagnostic court et 3 actions (prudent / aggressive / premium) directement publiables.
Pour chaque action : la cible client, le prix conseillé, un conseil de marge, le canal et le moment.

${JSON_SHAPE}`;
}
