import type { AdvisorObjective } from "@/types";

// Actions commerciales simples proposées sur l'accueil.
// Chaque action préremplit l'intention et l'objectif sur /app/today.

export interface UsefulAction {
  label: string;
  objective: AdvisorObjective;
  /** Intention préremplie (le commerçant peut la modifier). */
  intention: string;
  hint: string;
}

export const USEFUL_ACTIONS: UsefulAction[] = [
  { label: "Créer une offre", objective: "sell_today", intention: "", hint: "Vendre aujourd'hui" },
  { label: "Écouler un stock", objective: "clear_stock", intention: "J'ai trop de stock à écouler aujourd'hui", hint: "Sans casser vos prix" },
  { label: "Remplir un créneau calme", objective: "fill_empty_slot", intention: "J'ai peu de monde sur une période calme", hint: "Heures creuses" },
  { label: "Augmenter le panier moyen", objective: "increase_basket", intention: "Je veux vendre plus par client", hint: "Packs malins" },
  { label: "Relancer mes clients", objective: "bring_back_customers", intention: "Je veux faire revenir mes clients", hint: "Faire revenir" },
  { label: "Demander des avis", objective: "get_reviews", intention: "Je veux demander des avis Google", hint: "Crédibilité locale" },
  { label: "Créer un coupon fidélité", objective: "build_loyalty", intention: "Je veux fidéliser mes meilleurs clients", hint: "Fidélité" },
  { label: "Préparer le menu du jour", objective: "sell_today", intention: "Je veux préparer mon menu du jour", hint: "Snack / restaurant" },
];
