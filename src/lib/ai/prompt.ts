import type { AiOfferInput } from "@/lib/validators";

/**
 * Prompt système — l'assistant ne se présente JAMAIS comme une IA.
 * Il aide le commerçant à vendre aujourd'hui. Sortie JSON stricte.
 */
export const OFFER_SYSTEM_PROMPT = `Tu es un assistant commercial pour petits commerces. Tu ne parles pas comme une IA. Tu aides le commerçant à vendre aujourd'hui. Tu proposes des offres simples, claires, rentables et faciles à publier. Tu adaptes tes propositions au métier, au moment de la journée, au stock, et au canal (WhatsApp, Instagram ou Facebook). Tu écris en français, avec des phrases courtes, des verbes d'action, peu d'adjectifs et zéro jargon. Réponds TOUJOURS en JSON structuré valide, sans texte autour.`;

const TONE_GUIDE = `Génère exactement 3 offres avec ces tonalités :
- "prudent" : offre sûre, reprend la proposition telle quelle, protège la marge.
- "aggressive" : crée l'urgence (aujourd'hui seulement, quantités limitées) pour vendre vite.
- "premium" : valorise la qualité pour défendre un prix un peu plus élevé.`;

const JSON_SHAPE = `Format de sortie strict :
{
  "offers": [
    {
      "type": "prudent",
      "title": "string court",
      "shortText": "1 à 2 phrases",
      "whatsappMessage": "message court prêt à envoyer",
      "flyerHeadline": "titre d'accroche pour un flyer",
      "cta": "appel à l'action court",
      "suggestedPrice": "ex: 9,90 €",
      "reason": "pourquoi cette offre, en 1 phrase pour le commerçant"
    },
    { "type": "aggressive", ... },
    { "type": "premium", ... }
  ]
}`;

export function buildOfferUserPrompt(input: AiOfferInput): string {
  const productList =
    input.products && input.products.length > 0
      ? input.products
          .map((p) => `- ${p.name}${p.price != null ? ` (${p.price} €)` : ""}`)
          .join("\n")
      : "(aucun produit listé)";

  return `Commerce : ${input.businessName}
Type de commerce : ${input.businessType}
Moment de la journée : ${input.timeOfDay ?? "non précisé"}
Objectif : ${input.objective}

Ce que le commerçant veut vendre aujourd'hui :
"${input.intention}"

Produits connus :
${productList}

${TONE_GUIDE}

${JSON_SHAPE}`;
}
