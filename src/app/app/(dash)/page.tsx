"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBusiness, useOffers } from "@/lib/store/use-store";
import { getDailyActions } from "@/lib/autopilot";
import { getBusinessType } from "@/data/business-types";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { OfferCard } from "@/components/offers/OfferCard";
import { EmptyState } from "@/components/ui/States";

const QUICK = [
  { href: "/app/today", label: "Créer une offre" },
  { href: "/app/menu", label: "Menu du jour" },
  { href: "/app/products", label: "Ajouter produit" },
  { href: "/app/customers", label: "Relancer clients" },
  { href: "/app/flyers", label: "Voir QR code" },
  { href: "/app/menu", label: "Afficher sur TV" },
];

export default function AppHome() {
  const router = useRouter();
  const business = useBusiness();
  const offers = useOffers();
  const [intention, setIntention] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  // Pas encore de commerce → onboarding.
  useEffect(() => {
    if (ready && !business) router.replace("/app/onboarding");
  }, [ready, business, router]);

  if (!ready || !business) return null;

  const typeDef = getBusinessType(business.type);
  const actions = getDailyActions(business.type);
  const placeholder = `Ex : ${typeDef.examples[0]}`;

  function go(text: string) {
    const t = text.trim();
    if (!t) return;
    router.push(`/app/today?intention=${encodeURIComponent(t)}`);
  }

  return (
    <div className="flex flex-col gap-7">
      <header>
        <p className="text-[0.9375rem] text-ink-soft">Bonjour {business.name}</p>
        <h1 className="font-display text-2xl font-semibold">Votre commerce est prêt.</h1>
      </header>

      {/* Zone principale : l'unique action centrale */}
      <Card className="bg-surface">
        <h2 className="font-display text-xl font-semibold">
          Que voulez-vous vendre aujourd&apos;hui ?
        </h2>
        <div className="mt-4">
          <Textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            placeholder={placeholder}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {typeDef.examples.slice(0, 3).map((ex) => (
            <button
              key={ex}
              onClick={() => setIntention(ex)}
              className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs text-ink-soft hover:border-ink hover:text-ink"
            >
              {ex}
            </button>
          ))}
        </div>
        <Button className="mt-4" block onClick={() => go(intention)} disabled={!intention.trim()}>
          Créer l&apos;offre
        </Button>
      </Card>

      {/* Autopilot : 3 actions du jour */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Idées du jour</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {actions.map((a) => (
            <Card key={a.label} interactive onClick={() => go(a.prompt)} className="bg-surface">
              <p className="font-medium text-ink">{a.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{a.hint}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Accès rapides */}
      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Accès rapides</h2>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {QUICK.map((q) => (
            <LinkButton key={q.label} href={q.href} variant="secondary" className="justify-start">
              {q.label}
            </LinkButton>
          ))}
        </div>
      </section>

      {/* Offres récentes */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Offres récentes</h2>
          <LinkButton href="/app/flyers" variant="ghost" size="sm">
            Tout voir
          </LinkButton>
        </div>
        {offers.length === 0 ? (
          <EmptyState
            title="Aucune offre pour le moment."
            description="Créez votre première offre et commencez à publier aujourd'hui."
            action={<LinkButton href="/app/today">Créer mon offre</LinkButton>}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {offers.slice(0, 4).map((o) => (
              <OfferCard key={o.id} offer={o} onView={() => router.push("/app/flyers")} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
