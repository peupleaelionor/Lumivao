import type { BusinessTypeKey } from "@/types";

// ── LUMIVAO Autopilot (v1, local) ────────────────────────────────────
// Propose chaque jour 3 actions adaptées au type de commerce.
// Logique locale pour commencer ; enrichissable ensuite par le modèle.

export interface AutopilotAction {
  /** Pré-rempli dans le champ « Que voulez-vous vendre aujourd'hui ? ». */
  prompt: string;
  label: string;
  hint: string;
}

const ACTIONS: Record<BusinessTypeKey, AutopilotAction[]> = {
  snack: [
    { label: "Menu midi", hint: "L'heure du déjeuner approche", prompt: "Menu midi du jour à 9,90 €" },
    { label: "Promo boisson", hint: "Augmentez le panier moyen", prompt: "Boisson offerte pour tout menu acheté aujourd'hui" },
    { label: "Pack famille", hint: "Idéal pour le soir", prompt: "Pack famille : 4 plats + 4 boissons à 29 €" },
  ],
  restaurant: [
    { label: "Plat du jour", hint: "Mettez en avant la spécialité", prompt: "Plat du jour maison à 12,50 €" },
    { label: "Formule midi", hint: "Captez la clientèle du déjeuner", prompt: "Formule midi entrée + plat à 15,90 €" },
    { label: "Soirée spéciale", hint: "Remplissez la salle ce soir", prompt: "Spécialité maison ce soir, places limitées" },
  ],
  epicerie: [
    { label: "Arrivage du jour", hint: "Produits frais reçus ce matin", prompt: "Arrivage frais du jour, quantités limitées" },
    { label: "Promo pack", hint: "Vendez plus d'un coup", prompt: "Lot de 3 produits au prix de 2 aujourd'hui" },
    { label: "Liquidation stock", hint: "Écoulez avant fermeture", prompt: "Déstockage ce soir : -30 % sur une sélection" },
  ],
  salon: [
    { label: "Créneau libre", hint: "Remplissez un trou dans l'agenda", prompt: "Créneau disponible cet après-midi : coupe + brushing à 25 €" },
    { label: "Offre semaine", hint: "Fidélisez sur la durée", prompt: "Offre de la semaine : soin + coiffage à 35 €" },
    { label: "Fidélité", hint: "Faites revenir vos clientes", prompt: "5e prestation : un soin offert" },
  ],
  onglerie: [
    { label: "Pose du jour", hint: "Mettez en avant une pose", prompt: "Pose gel complète à 30 € aujourd'hui" },
    { label: "Créneau libre", hint: "Comblez l'agenda", prompt: "Créneau libre cet après-midi : semi-permanent à 18 €" },
    { label: "Fidélité", hint: "Récompensez vos habituées", prompt: "Carte fidélité : 5 poses = 1 offerte" },
  ],
  telephone: [
    { label: "Accessoire du jour", hint: "Vente rapide", prompt: "Coque + verre trempé offerts à 15 € aujourd'hui" },
    { label: "Réparation écran", hint: "Service à forte marge", prompt: "Réparation écran iPhone dès 39 €, en 30 minutes" },
    { label: "Pack protection", hint: "Augmentez le panier", prompt: "Pack protection complet (coque + verre + assurance) à 25 €" },
  ],
  pressing: [
    { label: "Offre express", hint: "Service rapide mis en avant", prompt: "5 chemises lavées + repassées à 10 € aujourd'hui" },
    { label: "Pack saison", hint: "Articles volumineux", prompt: "Nettoyage couette + plaid à 20 €" },
    { label: "Fidélité", hint: "Faites revenir", prompt: "10e dépôt : un costume nettoyé offert" },
  ],
  bazar: [
    { label: "Article du jour", hint: "Produit phare", prompt: "Set cuisine 12 pièces à 19,90 € aujourd'hui" },
    { label: "Promo lot", hint: "Vendez en quantité", prompt: "Lot de 5 articles maison à 10 €" },
    { label: "Déstockage", hint: "Faites de la place", prompt: "Déstockage : -30 % sur une sélection aujourd'hui" },
  ],
};

/** Renvoie les 3 actions du jour pour un type de commerce. */
export function getDailyActions(type: BusinessTypeKey): AutopilotAction[] {
  return ACTIONS[type] ?? ACTIONS.snack;
}
