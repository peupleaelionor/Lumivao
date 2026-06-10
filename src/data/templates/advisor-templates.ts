import type {
  AdviceAction,
  AdviceChannel,
  AdvisorObjective,
  AdvisorResponse,
  BusinessTypeKey,
} from "@/types";

// ── Fallback local du conseiller (sans OpenAI) ───────────────────────
// Garantit un diagnostic + 3 actions concrètes par métier, toujours.
// Le but : ne jamais bloquer le commerçant.

const OBJECTIVE_LABEL: Record<AdvisorObjective, string> = {
  sell_today: "Vendre aujourd'hui",
  clear_stock: "Écouler un stock",
  increase_basket: "Augmenter le panier moyen",
  bring_back_customers: "Faire revenir les clients",
  fill_empty_slot: "Remplir une heure creuse",
  get_reviews: "Obtenir des avis",
  build_loyalty: "Fidéliser",
};

interface Playbook {
  /** Cibles clients fréquentes du métier. */
  targets: string[];
  diagnosis: (name: string) => string;
  opportunity: string;
  /** 3 actions : prudent / aggressive / premium. */
  actions: [PlaybookAction, PlaybookAction, PlaybookAction];
}

interface PlaybookAction {
  goal: string;
  title: string;
  offer: string;
  price: string;
  margin: string;
  channel: AdviceChannel;
  time: string;
  cta: string;
  why: string;
}

const PLAYBOOKS: Record<BusinessTypeKey, Playbook> = {
  snack: {
    targets: ["travailleurs du midi", "étudiants", "familles du soir", "habitués"],
    diagnosis: (n) => `Le service du midi est votre moment le plus rentable chez ${n}.`,
    opportunity: "Transformer chaque commande en menu pour augmenter le panier.",
    actions: [
      { goal: "Menu midi", title: "Menu du jour avec boisson", offer: "Plat + boisson à prix menu", price: "9,90 €", margin: "Gardez la marge : la boisson coûte peu et augmente le ticket.", channel: "WhatsApp", time: "11h–13h", cta: "Commander sur WhatsApp", why: "Le menu augmente le panier sans baisser le prix du plat." },
      { goal: "Promo midi", title: "Boisson offerte ce midi", offer: "Boisson offerte pour tout plat", price: "Prix plat inchangé", margin: "Offrez la boisson plutôt que de remiser le plat : marge protégée.", channel: "WhatsApp", time: "11h–14h", cta: "J'en profite ce midi", why: "Le cadeau attire sans casser le prix de référence." },
      { goal: "Pack famille", title: "Pack famille du soir", offer: "4 plats + 4 boissons", price: "29 €", margin: "Le pack vend plus d'un coup et lisse votre marge.", channel: "WhatsApp", time: "18h–21h", cta: "Réserver le pack", why: "Un seul client achète pour quatre : panier maximal." },
    ],
  },
  restaurant: {
    targets: ["clientèle du déjeuner", "familles", "couples du soir", "habitués"],
    diagnosis: (n) => `La formule midi remplit la salle de ${n} quand le passage est régulier.`,
    opportunity: "Mettre en avant la spécialité pour justifier un ticket plus élevé.",
    actions: [
      { goal: "Formule midi", title: "Formule entrée + plat", offer: "Entrée + plat du jour", price: "15,90 €", margin: "Bonne marge sur l'entrée : valorisez-la dans la formule.", channel: "WhatsApp", time: "12h–14h", cta: "Réserver une table", why: "La formule rassure sur le prix et remplit le midi." },
      { goal: "Soirée spéciale", title: "Spécialité maison ce soir", offer: "Plat signature en quantité limitée", price: "14 €", margin: "Quantité limitée : vous écoulez sans surproduire.", channel: "Instagram", time: "18h–20h", cta: "Je réserve ce soir", why: "La rareté crée l'envie de venir aujourd'hui." },
      { goal: "Menu découverte", title: "Menu découverte 3 plats", offer: "Entrée + plat + dessert", price: "24 €", margin: "Le dessert maison a une forte marge : incluez-le.", channel: "Boutique", time: "Soir", cta: "Réserver l'expérience", why: "Plus de plats par client = ticket plus élevé." },
    ],
  },
  epicerie: {
    targets: ["clients du quartier", "familles", "acheteurs en lot", "clients du week-end"],
    diagnosis: (n) => `Chez ${n}, les lots vendent mieux que les remises à l'unité.`,
    opportunity: "Grouper les produits en lots pour augmenter le panier.",
    actions: [
      { goal: "Arrivage du jour", title: "Arrivage frais du jour", offer: "Produits frais reçus ce matin", price: "Prix du jour", margin: "Mettez en avant la fraîcheur, pas la remise.", channel: "WhatsApp", time: "Matin", cta: "Voir les produits", why: "La fraîcheur attire sans toucher à la marge." },
      { goal: "Promo stock", title: "Lot promo à écouler", offer: "Lot de 3 au prix de 2", price: "5 €", margin: "Le lot écoule le stock tout en gardant un prix correct.", channel: "WhatsApp", time: "Après-midi", cta: "Je profite du lot", why: "Vous videz le stock sans brader l'unité." },
      { goal: "Panier week-end", title: "Panier garni week-end", offer: "Sélection de produits en panier", price: "19,90 €", margin: "Le panier mélange forte et faible marge : équilibre gagnant.", channel: "Boutique", time: "Vendredi–samedi", cta: "Commander le panier", why: "Un panier vend plusieurs produits d'un coup." },
    ],
  },
  salon: {
    targets: ["clientes fidèles", "nouvelles clientes", "duos d'amies", "créneaux semaine"],
    diagnosis: (n) => `Les créneaux calmes de ${n} peuvent devenir une offre semaine.`,
    opportunity: "Remplir les heures creuses sans dévaloriser les prestations.",
    actions: [
      { goal: "Offre semaine", title: "Prestation de la semaine", offer: "Soin + coiffage", price: "35 €", margin: "Offre cadrée sur la semaine : marge maîtrisée.", channel: "WhatsApp", time: "Mardi–jeudi", cta: "Prendre rendez-vous", why: "Limiter à la semaine remplit sans brader." },
      { goal: "Heure creuse", title: "Créneau après-midi", offer: "Coupe + brushing en créneau calme", price: "25 €", margin: "Vous remplissez un temps mort : tout revenu est bon.", channel: "WhatsApp", time: "14h–17h", cta: "Je réserve mon créneau", why: "Une heure vide ne rapporte rien : autant la remplir." },
      { goal: "Pack soin", title: "Pack soin complet", offer: "Soin + coiffage + conseil", price: "45 €", margin: "Le pack augmente le ticket avec des prestations à bonne marge.", channel: "Boutique", time: "Semaine", cta: "Réserver ma prestation", why: "Plus de prestations par cliente = panier plus élevé." },
    ],
  },
  onglerie: {
    targets: ["clientes fidèles", "nouvelles clientes", "duos", "clientes anniversaire"],
    diagnosis: (n) => `Chez ${n}, les créneaux libres se remplissent avec une offre simple.`,
    opportunity: "Proposer une pose phare et fidéliser les habituées.",
    actions: [
      { goal: "Pose du jour", title: "Pose gel du jour", offer: "Pose complète gel", price: "30 €", margin: "Prix juste : ne descendez pas sous votre coût horaire.", channel: "WhatsApp", time: "Journée", cta: "Prendre rendez-vous", why: "Une pose claire et lisible déclenche la réservation." },
      { goal: "Heure creuse", title: "Créneau libre cet après-midi", offer: "Semi-permanent en créneau calme", price: "18 €", margin: "Remplir un créneau vide vaut mieux qu'une chaise vide.", channel: "WhatsApp", time: "14h–17h", cta: "Je réserve aujourd'hui", why: "Vous transformez un temps mort en revenu." },
      { goal: "Fidélité", title: "Carte fidélité pose", offer: "5 poses = 1 offerte", price: "Selon prestation", margin: "La récompense différée fidélise sans coût immédiat.", channel: "Boutique", time: "Toute la semaine", cta: "Réserver ma pose", why: "La fidélité ramène les habituées plus souvent." },
    ],
  },
  telephone: {
    targets: ["clients réparation", "acheteurs d'accessoires", "jeunes", "clients iPhone"],
    diagnosis: (n) => `Chez ${n}, associer accessoires augmente le panier sans effort.`,
    opportunity: "Créer des packs accessoires autour de chaque vente.",
    actions: [
      { goal: "Accessoire du jour", title: "Accessoire du jour", offer: "Coque + verre trempé", price: "15 €", margin: "Forte marge sur les accessoires : mettez-les en avant.", channel: "WhatsApp", time: "Journée", cta: "Demander sur WhatsApp", why: "Un accessoire bien présenté se vend en impulsion." },
      { goal: "Pack protection", title: "Pack protection complet", offer: "Coque + verre + pose", price: "25 €", margin: "Le pack augmente le ticket avec des marges confortables.", channel: "Boutique", time: "Journée", cta: "J'en profite", why: "Vendre la protection avec le téléphone double le panier." },
      { goal: "Réparation", title: "Réparation écran express", offer: "Écran remplacé en 30 min", price: "dès 39 €", margin: "Service à forte valeur : ne le bradez pas.", channel: "WhatsApp", time: "Journée", cta: "Réserver la réparation", why: "La rapidité justifie un bon prix et attire." },
    ],
  },
  pressing: {
    targets: ["actifs pressés", "familles", "clients costumes", "habitués"],
    diagnosis: (n) => `Chez ${n}, les lots de pièces fidélisent et lissent l'activité.`,
    opportunity: "Proposer des forfaits multi-pièces pour régulariser le flux.",
    actions: [
      { goal: "Offre express", title: "Forfait chemises", offer: "5 chemises lavées + repassées", price: "10 €", margin: "Le forfait optimise votre temps machine : marge correcte.", channel: "WhatsApp", time: "Matin", cta: "Déposer sur WhatsApp", why: "Le forfait attire les actifs réguliers." },
      { goal: "Promo saison", title: "Nettoyage couette", offer: "Couette + plaid nettoyés", price: "20 €", margin: "Articles volumineux : bon revenu par passage.", channel: "Boutique", time: "Semaine", cta: "Je dépose aujourd'hui", why: "Les pièces de saison relancent l'activité." },
      { goal: "Fidélité", title: "Carte fidélité pressing", offer: "10e dépôt : 1 costume offert", price: "Selon dépôts", margin: "Récompense différée : fidélise à faible coût.", channel: "Boutique", time: "Continu", cta: "Réserver le service", why: "La fidélité ramène les dépôts réguliers." },
    ],
  },
  bazar: {
    targets: ["clients du quartier", "familles", "acheteurs en lot", "chineurs"],
    diagnosis: (n) => `Chez ${n}, les lots écoulent le stock mieux que les remises sèches.`,
    opportunity: "Grouper les invendus en lots attractifs.",
    actions: [
      { goal: "Article du jour", title: "Article phare du jour", offer: "Produit vedette mis en avant", price: "19,90 €", margin: "Mettez en avant la valeur, pas la casse de prix.", channel: "WhatsApp", time: "Journée", cta: "Voir en boutique", why: "Un produit vedette attire en boutique." },
      { goal: "Promo lot", title: "Lot à prix rond", offer: "Lot de 5 articles maison", price: "10 €", margin: "Le lot écoule le stock dormant sans tout brader.", channel: "WhatsApp", time: "Après-midi", cta: "Je profite maintenant", why: "Le prix rond déclenche l'achat groupé." },
      { goal: "Déstockage", title: "Déstockage du soir", offer: "-30 % sur une sélection", price: "Sélection", margin: "Ciblez le déstockage sur les invendus, pas tout le magasin.", channel: "Boutique", time: "Fin de journée", cta: "Réserver mon lot", why: "Le déstockage ciblé fait de la place sans tout sacrifier." },
    ],
  },
};

function toAction(p: PlaybookAction, tone: AdviceAction["type"], ctx: { name: string; target: string; intention: string }): AdviceAction {
  const intentNote = ctx.intention ? ` (${ctx.intention.trim()})` : "";
  return {
    type: tone,
    goal: p.goal,
    title: p.title,
    offer: p.offer,
    targetCustomer: ctx.target,
    recommendedPrice: p.price,
    marginAdvice: p.margin,
    bestChannel: p.channel,
    bestTime: p.time,
    whatsappMessage: `Bonjour 👋 Chez ${ctx.name} : ${p.title} — ${p.offer}${p.price.match(/\d/) ? ` à ${p.price}` : ""}.${intentNote} ${p.cta}.`,
    flyerHeadline: `${p.title}\n${p.offer}`,
    cta: p.cta,
    whyItWorks: p.why,
  };
}

export function buildLocalAdvice(params: {
  businessType: BusinessTypeKey;
  businessName: string;
  objective: AdvisorObjective;
  intention?: string;
}): AdvisorResponse {
  const { businessType, businessName, objective } = params;
  const intention = params.intention ?? "";
  const pb = PLAYBOOKS[businessType] ?? PLAYBOOKS.snack;
  const tones: AdviceAction["type"][] = ["prudent", "aggressive", "premium"];

  const actions = pb.actions.map((a, i) =>
    toAction(a, tones[i] ?? "prudent", {
      name: businessName,
      target: pb.targets[i] ?? pb.targets[0] ?? "vos clients",
      intention,
    }),
  );

  return {
    diagnosis: {
      summary: pb.diagnosis(businessName),
      mainOpportunity: pb.opportunity,
      risk: "Évitez les remises trop fortes : elles abîment l'image et la marge.",
      recommendedFocus: OBJECTIVE_LABEL[objective],
    },
    actions,
    nextSteps: [
      { label: "Préparer les supports", action: "prepare_supports" },
      { label: "Relancer mes clients", action: "open_customers" },
    ],
    source: "local",
  };
}
