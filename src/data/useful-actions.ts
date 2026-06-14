import type { AdvisorObjective } from "@/types";

// Actions commerciales simples proposées sur l'accueil.
// Chaque action préremplit l'intention et l'objectif sur /app/today.

export type ActionIcon = "tag" | "stack" | "chart" | "person" | "chat" | "tv";

export interface UsefulAction {
  label: string;
  objective: AdvisorObjective;
  /** Intention préremplie (le commerçant peut la modifier). */
  intention: string;
  icon: ActionIcon;
  tone: "green" | "orange";
}

export const USEFUL_ACTIONS: UsefulAction[] = [
  { label: "Créer une offre", objective: "sell_today", intention: "", icon: "tag", tone: "green" },
  { label: "Écouler un stock", objective: "clear_stock", intention: "J'ai trop de stock à écouler aujourd'hui", icon: "stack", tone: "orange" },
  { label: "Augmenter panier moyen", objective: "increase_basket", intention: "Je veux vendre plus par client", icon: "chart", tone: "green" },
  { label: "Relancer clients", objective: "bring_back_customers", intention: "Je veux faire revenir mes clients", icon: "person", tone: "orange" },
  { label: "Demander des avis", objective: "get_reviews", intention: "Je veux demander des avis Google", icon: "chat", tone: "green" },
  { label: "Afficher sur TV", objective: "sell_today", intention: "Je veux afficher mon offre du jour sur un écran", icon: "tv", tone: "orange" },
];
