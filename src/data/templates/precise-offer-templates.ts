import type { AdviceChannel, BusinessTypeKey, EngineStrategy } from "@/types";

// ── Fallback local du moteur d'offres ────────────────────────────────
// 3 offres précises par métier : marge protégée / vente rapide / panier
// premium. Garantit un résultat exploitable sans OpenAI.

export interface PreciseOffer {
  strategy: EngineStrategy;
  name: string;
  price: string;
  target: string;
  channel: AdviceChannel;
  bestTime: string;
  reason: string;
  marginAdvice: string;
  cta: string;
}

type Triple = [PreciseOffer, PreciseOffer, PreciseOffer];

const T = (
  strategy: EngineStrategy,
  name: string,
  price: string,
  target: string,
  channel: AdviceChannel,
  bestTime: string,
  reason: string,
  marginAdvice: string,
  cta: string,
): PreciseOffer => ({ strategy, name, price, target, channel, bestTime, reason, marginAdvice, cta });

export const PRECISE_TEMPLATES: Record<BusinessTypeKey, Triple> = {
  snack: [
    T("marge_protegee", "Menu midi poulet + riz + boisson", "9,90 €", "travailleurs du midi", "WhatsApp", "11h30–14h", "Le menu augmente le ticket sans baisser le prix du plat.", "La boisson coûte peu et protège la marge.", "Commander sur WhatsApp"),
    T("vente_rapide", "Aujourd'hui 11h30–14h : menu + boisson offerte", "9,90 €", "clients pressés du midi", "WhatsApp", "11h30–14h", "L'horaire limité déclenche la décision aujourd'hui.", "Offrez la boisson plutôt que de remiser le plat.", "J'en profite ce midi"),
    T("panier_premium", "Pack famille 4 personnes", "34,90 €", "familles du soir", "WhatsApp", "18h–21h", "Un seul client achète pour quatre : panier maximal.", "Le pack lisse la marge sur plusieurs plats.", "Réserver le pack"),
  ],
  restaurant: [
    T("marge_protegee", "Formule entrée + plat du jour", "15,90 €", "clientèle du déjeuner", "WhatsApp", "12h–14h", "La formule rassure sur le prix et remplit le midi.", "Bonne marge sur l'entrée : valorisez-la.", "Réserver une table"),
    T("vente_rapide", "Spécialité maison ce soir, places limitées", "14 €", "habitués du quartier", "Instagram", "18h–20h", "La rareté crée l'envie de venir aujourd'hui.", "Quantité limitée : pas de surproduction.", "Je réserve ce soir"),
    T("panier_premium", "Menu découverte 3 plats", "24 €", "couples et tables du soir", "Boutique", "Soir", "Plus de plats par client = ticket plus élevé.", "Le dessert maison a une forte marge.", "Réserver l'expérience"),
  ],
  epicerie: [
    T("marge_protegee", "Pack goûter : 2 boissons + 1 snack", "5,90 €", "familles du quartier", "WhatsApp", "Après-midi", "Le pack vend plusieurs produits d'un coup.", "Mélange forte et faible marge : équilibre gagnant.", "Voir le pack"),
    T("vente_rapide", "Jusqu'à 18h : lot de 3 boissons à 5 €", "5 €", "clients de passage", "WhatsApp", "Jusqu'à 18h", "L'horaire limité écoule le stock aujourd'hui.", "Le lot écoule sans brader l'unité.", "Je profite du lot"),
    T("panier_premium", "Panier week-end boissons + snacks", "19,90 €", "clients du week-end", "Boutique", "Vendredi–samedi", "Le panier augmente nettement le ticket.", "Composez avec des produits à bonne marge.", "Commander le panier"),
  ],
  salon: [
    T("marge_protegee", "Brushing + soin express", "29 €", "clientes fidèles", "WhatsApp", "Semaine", "Le duo prestation protège la valeur.", "Marge maîtrisée : pas de remise sèche.", "Prendre rendez-vous"),
    T("vente_rapide", "Créneaux libres aujourd'hui : -5 € avant 17h", "dès 25 €", "clientes disponibles en journée", "WhatsApp", "14h–17h", "Remplir un créneau vide vaut mieux qu'une chaise vide.", "Petite baisse ciblée sur un temps mort uniquement.", "Je réserve mon créneau"),
    T("panier_premium", "Pack complet soin + coiffage + finition", "49 €", "clientes événement", "Boutique", "Semaine", "Plus de prestations par cliente = panier élevé.", "Prestations à bonne marge cumulées.", "Réserver ma prestation"),
  ],
  onglerie: [
    T("marge_protegee", "Pose gel + finition", "30 €", "clientes fidèles", "WhatsApp", "Journée", "Une pose claire déclenche la réservation.", "Ne descendez pas sous votre coût horaire.", "Prendre rendez-vous"),
    T("vente_rapide", "Créneau libre cet après-midi : semi-permanent", "18 €", "clientes disponibles", "WhatsApp", "14h–17h", "Vous transformez un temps mort en revenu.", "Remplir un créneau vide est toujours gagnant.", "Je réserve aujourd'hui"),
    T("panier_premium", "Pose + déco + retouche offerte", "39 €", "clientes événement", "Boutique", "Semaine", "La montée en gamme augmente le ticket.", "La retouche offerte fidélise sans coût immédiat.", "Réserver ma pose"),
  ],
  telephone: [
    T("marge_protegee", "Pack coque + verre trempé", "15 €", "acheteurs d'accessoires", "WhatsApp", "Journée", "L'accessoire se vend en impulsion.", "Forte marge sur les accessoires.", "Demander sur WhatsApp"),
    T("vente_rapide", "Aujourd'hui : coque iPhone + pose offerte", "12 €", "jeunes clients iPhone", "WhatsApp", "Journée", "L'offre du jour pousse l'achat immédiat.", "Pose à coût quasi nul : marge protégée.", "J'en profite"),
    T("panier_premium", "Pack protection complet (coque + verre + pose)", "25 €", "clients soigneux", "Boutique", "Journée", "Vendre la protection double le panier.", "Marges confortables cumulées.", "Réserver le pack"),
  ],
  pressing: [
    T("marge_protegee", "Forfait 5 chemises lavées + repassées", "10 €", "actifs réguliers", "WhatsApp", "Matin", "Le forfait optimise votre temps machine.", "Marge correcte sur le volume.", "Déposer sur WhatsApp"),
    T("vente_rapide", "Aujourd'hui : couette + plaid nettoyés", "20 €", "familles", "Boutique", "Journée", "Les pièces de saison relancent l'activité.", "Bon revenu par passage.", "Je dépose aujourd'hui"),
    T("panier_premium", "Forfait famille 10 pièces", "22 €", "familles nombreuses", "Boutique", "Semaine", "Plus de pièces par dépôt = ticket élevé.", "Le forfait fidélise et lisse la charge.", "Réserver le forfait"),
  ],
  bazar: [
    T("marge_protegee", "Lot de 5 articles maison", "10 €", "clients du quartier", "WhatsApp", "Journée", "Le prix rond déclenche l'achat groupé.", "Le lot écoule sans tout brader.", "Voir en boutique"),
    T("vente_rapide", "Prix flash jusqu'à ce soir sur une sélection", "Sélection", "chineurs et passants", "WhatsApp", "Fin de journée", "L'horaire limité crée l'urgence.", "Ciblez les invendus, pas tout le magasin.", "Je profite maintenant"),
    T("panier_premium", "Pack maison 12 pièces", "19,90 €", "familles", "Boutique", "Week-end", "Le pack vend plusieurs articles d'un coup.", "Composez avec des articles à bonne marge.", "Réserver mon pack"),
  ],
};

export function preciseTemplatesFor(type: BusinessTypeKey): Triple {
  return PRECISE_TEMPLATES[type] ?? PRECISE_TEMPLATES.snack;
}
