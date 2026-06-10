import type { BusinessTypeKey } from "@/types";

export interface BusinessTypeDef {
  key: BusinessTypeKey;
  label: string;
  emoji: string;
  /** Exemples affichés dans le champ « Que voulez-vous vendre aujourd'hui ? » */
  examples: string[];
  productLabel: string;
  defaultCta: string;
}

export const BUSINESS_TYPES: BusinessTypeDef[] = [
  {
    key: "snack",
    label: "Snack",
    emoji: "🍔",
    examples: [
      "Poulet braisé + riz + boisson à 9,90 €",
      "2 tacos + frites à 7,90 €",
      "Menu burger maison à 8,50 €",
    ],
    productLabel: "plat",
    defaultCta: "Commander sur WhatsApp",
  },
  {
    key: "restaurant",
    label: "Restaurant",
    emoji: "🍽️",
    examples: [
      "Menu midi : thieb + jus maison à 11,50 €",
      "Spécialité maison du jour à 14 €",
      "Formule entrée + plat à 16,90 €",
    ],
    productLabel: "plat",
    defaultCta: "Réserver sur WhatsApp",
  },
  {
    key: "epicerie",
    label: "Épicerie",
    emoji: "🛒",
    examples: [
      "Lot de 3 boissons à 5 €",
      "Arrivage fruits frais ce matin",
      "Panier garni à 19,90 €",
    ],
    productLabel: "produit",
    defaultCta: "Voir les produits du jour",
  },
  {
    key: "salon",
    label: "Salon coiffure",
    emoji: "💈",
    examples: [
      "Pack shampoing + brushing à 25 € aujourd'hui",
      "Tresses vanilles + soin à 45 €",
      "Coupe + barbe à 20 €",
    ],
    productLabel: "prestation",
    defaultCta: "Réserver sur WhatsApp",
  },
  {
    key: "onglerie",
    label: "Onglerie",
    emoji: "💅",
    examples: [
      "Pose complète gel à 30 € cette semaine",
      "Vernis semi-permanent à 18 €",
      "Beauté des pieds à 25 €",
    ],
    productLabel: "prestation",
    defaultCta: "Prendre rendez-vous",
  },
  {
    key: "telephone",
    label: "Boutique téléphone",
    emoji: "📱",
    examples: [
      "Coque iPhone 14 à 12 € — promo jusqu'à ce soir",
      "Réparation écran iPhone dès 39 €",
      "Chargeur rapide à 9,90 €",
    ],
    productLabel: "produit",
    defaultCta: "Demander sur WhatsApp",
  },
  {
    key: "pressing",
    label: "Pressing",
    emoji: "👔",
    examples: [
      "Nettoyage costume 2 pièces à 12 €",
      "5 chemises lavées + repassées à 10 €",
      "Couette nettoyée à 15 €",
    ],
    productLabel: "service",
    defaultCta: "Déposer sur WhatsApp",
  },
  {
    key: "bazar",
    label: "Bazar",
    emoji: "🏬",
    examples: [
      "Lot de 5 articles maison à 10 €",
      "Déstockage rentrée : -30 % aujourd'hui",
      "Set cuisine 12 pièces à 19,90 €",
    ],
    productLabel: "produit",
    defaultCta: "Voir en boutique",
  },
];

export function getBusinessType(key: BusinessTypeKey): BusinessTypeDef {
  return BUSINESS_TYPES.find((b) => b.key === key) ?? BUSINESS_TYPES[0]!;
}
