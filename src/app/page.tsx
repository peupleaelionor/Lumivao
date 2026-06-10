import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/Button";
import { PhoneMockup } from "@/components/landing/PhoneMockup";
import { PricingCard, type Plan } from "@/components/landing/PricingCard";

const PROBLEMS = [
  { n: "01", title: "Trop de temps pour une simple offre", text: "Écrire, mettre en page, envoyer, réadapter à chaque canal." },
  { n: "02", title: "Pas de rendu vraiment propre", text: "Sans graphiste, les visuels manquent souvent de clarté." },
  { n: "03", title: "Aucun support centralisé", text: "Chaque canal demande un format différent." },
  { n: "04", title: "Le commerce vend moins qu'il ne pourrait", text: "Parce que l'offre du jour n'est pas visible au bon moment." },
];

const MODULES = [
  { title: "Offres & flyers", text: "Créez une offre claire et obtenez des visuels prêts à publier." },
  { title: "Menu QR", text: "Affichez votre menu en boutique, lisible et toujours à jour." },
  { title: "Catalogue WhatsApp", text: "Partagez vos produits dans un format direct, adapté aux clients." },
  { title: "Fidélité", text: "Ajoutez un QR simple pour faire revenir vos meilleurs clients." },
  { title: "Affichage TV", text: "Diffusez vos offres du jour sur un écran en caisse ou en vitrine." },
  { title: "Mini-vitrine", text: "Une page publique légère : produits, horaires et offres." },
];

const USECASES = [
  { title: "Snack", text: "Menus du jour, combos, QR commande, affichage comptoir." },
  { title: "Épicerie", text: "Arrivages, promotions, lots, paniers, offres rapides à partager." },
  { title: "Salon", text: "Prestation du moment, avant/après, prise de contact, fidélité." },
  { title: "Boutique téléphone", text: "Accessoires, réparations, offres flash, produits vedettes." },
  { title: "Restaurant", text: "Menu midi, spécialité maison, QR table, commande et relance." },
  { title: "Onglerie", text: "Pose du jour, créneaux libres, rendez-vous, fidélité." },
];

const STEPS = [
  { n: "1", title: "Écrivez ce que vous voulez vendre", text: "Un plat, une promo, un service, un lot, un nouveau produit." },
  { n: "2", title: "LUMIVAO prépare les supports", text: "Visuels, QR, message, mini-vitrine, fidélité, affichage." },
  { n: "3", title: "Partagez partout où vos clients vous voient", text: "WhatsApp, Instagram, boutique, écran, QR en caisse." },
];

const PLANS: Plan[] = [
  { name: "Starter", price: "9,99 €", period: "/mois", tagline: "Pour commencer simplement.", cta: "Commencer", features: ["1 commerce", "Offres et flyers", "Mini-vitrine simple", "QR de partage", "Modèles essentiels"] },
  { name: "Pro", price: "19 €", period: "/mois", tagline: "Pour publier plus souvent et mieux vendre.", featured: true, cta: "Choisir Pro", features: ["Tout Starter", "Menu QR", "Catalogue WhatsApp", "Fidélité", "Affichage TV", "Plus de modèles"] },
  { name: "Business", price: "29 €", period: "/mois", tagline: "Pour un usage quotidien complet.", cta: "Passer à Business", features: ["Tout Pro", "Relance clients", "Avis Google", "Options boutique", "Gestion avancée des offres"] },
  { name: "Installation", price: "99 €", tagline: "Mise en place accompagnée.", cta: "Réserver l'installation", features: ["Configuration commerce", "Identité de base", "Modèles prêts à l'emploi", "QR et vitrine initiale"] },
];

const NAV = [
  { href: "#modules", label: "Fonctionnalités" },
  { href: "#usecases", label: "Cas d'usage" },
  { href: "#pricing", label: "Tarifs" },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-transparent bg-cream/85 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-content items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} className="text-[0.9375rem] text-ink-soft hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <LinkButton href="/app/onboarding" size="sm">
            Créer mon offre
          </LinkButton>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-content px-5 pb-20 pt-12 md:pt-16">
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-14">
          <div>
            <h1 className="text-balance font-display text-[clamp(2.25rem,6vw,3.5rem)] font-semibold leading-[1.06]">
              Vendez plus chaque jour, même sans site.
            </h1>
            <p className="mt-5 max-w-xl text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-relaxed text-ink-soft">
              LUMIVAO transforme une simple offre en flyer, QR code, message WhatsApp, menu et
              mini-vitrine en moins d&apos;une minute.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/app/onboarding" size="lg">
                Créer mon offre
              </LinkButton>
              <LinkButton href="/app" variant="secondary" size="lg">
                Voir une démo
              </LinkButton>
            </div>
            <p className="mt-7 text-[0.9375rem] text-ink-soft">
              Sans site. Sans graphiste. Sans complexité.
            </p>
          </div>
          <PhoneMockup />
        </div>
      </section>

      {/* Problème */}
      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-content px-5 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-green-dense">Le constat</p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
              Publier vite est devenu indispensable. Publier proprement reste compliqué.
            </h2>
            <p className="mt-4 text-[1.0625rem] text-ink-soft">
              Les petits commerces doivent annoncer leurs offres chaque jour. Mais entre WhatsApp,
              Instagram, la boutique, le menu et les clients à relancer, tout prend du temps.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((p) => (
              <div key={p.n} className="rounded-lg border border-line bg-surface p-6">
                <div className="font-display text-sm font-semibold text-orange-dense">{p.n}</div>
                <h3 className="mt-2.5 text-[1.125rem] font-semibold">{p.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-ink-soft">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="mx-auto max-w-content px-5 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-green-dense">La solution</p>
          <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
            Une offre devient tout de suite exploitable.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-line bg-surface p-6">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-ink-soft">
              Vous écrivez
            </p>
            <div className="mt-4 rounded border border-dashed border-line bg-cream p-4 font-medium">
              Poulet braisé + riz + boisson à{" "}
              <span className="text-orange-dense">9,90 €</span>
            </div>
          </div>
          <div className="rounded-lg border border-ink bg-ink p-6 text-cream">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-wide text-cream/60">
              LUMIVAO prépare
            </p>
            <ul className="mt-4 grid gap-2.5 text-[0.9375rem]">
              {["Un flyer carré", "Une story", "Une affiche A4", "Un message WhatsApp", "Un QR code commande", "Une mini-page publique", "Un coupon fidélité"].map((x) => (
                <li key={x} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-green" />
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center font-display text-lg font-semibold">
          Une seule saisie. Plusieurs points de vente.
        </p>
      </section>

      {/* Modules */}
      <section id="modules" className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-content px-5 py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
              Tout ce qu&apos;il faut pour publier et vendre. Rien de trop.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <div key={m.title} className="rounded-lg border border-line bg-surface p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-tint text-green-dense">
                  <span className="h-2.5 w-2.5 rounded-full bg-current" />
                </div>
                <h3 className="text-[1.1875rem] font-semibold">{m.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-ink-soft">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section id="usecases" className="mx-auto max-w-content px-5 py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
            Pensé pour les commerces qui doivent vendre aujourd&apos;hui.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {USECASES.map((u) => (
            <div key={u.title} className="rounded-lg border border-line bg-surface p-6">
              <span className="inline-flex rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-ink-soft">
                {u.title}
              </span>
              <p className="mt-3 text-[0.9375rem] text-ink-soft">{u.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Étapes */}
      <section className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-content px-5 py-20">
          <h2 className="max-w-2xl font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
            Trois étapes. Pas plus.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-lg border border-line bg-surface p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-cream">
                  {s.n}
                </div>
                <h3 className="mt-4 text-[1.1875rem] font-semibold">{s.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-ink-soft">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-display text-lg font-semibold">
            Votre offre existe enfin dans tous les bons formats.
          </p>
        </div>
      </section>

      {/* Tarifs */}
      <section id="pricing" className="mx-auto max-w-content px-5 py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
            Des tarifs simples, pensés pour les petits commerces.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <PricingCard key={p.name} plan={p} />
          ))}
        </div>
        <p className="mt-7 text-center text-ink-soft">
          Vous pouvez publier votre première offre le jour même.
        </p>
      </section>

      {/* Vision */}
      <section className="bg-ink text-cream">
        <div className="mx-auto max-w-content px-5 py-20">
          <p className="text-sm font-semibold uppercase tracking-wide text-green">La vision</p>
          <h2 className="mt-3 max-w-2xl font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight text-cream">
            Le copilote de vente quotidien des commerces locaux.
          </h2>
          <p className="mt-5 max-w-2xl text-[1.0625rem] text-cream/75">
            Demain, chaque petit commerce devra pouvoir publier une offre aussi facilement
            qu&apos;envoyer un message. LUMIVAO prend cette place : un outil simple, toujours prêt,
            qui aide à vendre, fidéliser et rester visible chaque jour.
          </p>
          <p className="mt-7 border-t border-cream/15 pt-6 font-display text-xl font-semibold">
            Le site n&apos;est plus le point de départ. L&apos;offre du jour l&apos;est.
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-content px-5 py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight">
          Votre commerce peut publier sa première offre aujourd&apos;hui.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[1.0625rem] text-ink-soft">
          Pas besoin d&apos;agence. Pas besoin d&apos;un site. Pas besoin d&apos;attendre.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <LinkButton href="/app/onboarding" size="lg">
            Créer mon offre
          </LinkButton>
          <LinkButton href="/app" variant="secondary" size="lg">
            Voir une démo
          </LinkButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink text-cream/70">
        <div className="mx-auto max-w-content px-5 py-14">
          <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <Logo mono />
              <p className="mt-3 max-w-xs text-[0.9375rem]">
                Vendez plus chaque jour, même sans site.
              </p>
            </div>
            <nav className="flex flex-wrap gap-x-7 gap-y-3">
              {["Fonctionnalités", "Tarifs", "Démo", "Contact", "Conditions", "Confidentialité"].map((l) => (
                <Link key={l} href="#" className="text-[0.9375rem] hover:text-cream">
                  {l}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-10 border-t border-cream/15 pt-6 text-[0.8125rem]">
            © {new Date().getFullYear()} LUMIVAO. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
