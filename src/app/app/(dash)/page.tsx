"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBusiness, useOffers } from "@/lib/store/use-store";
import { getBusinessType } from "@/data/business-types";
import { USEFUL_ACTIONS } from "@/data/useful-actions";
import { Button, LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { OfferCard } from "@/components/offers/OfferCard";
import { EmptyState } from "@/components/ui/States";
import { ConseilDuJour } from "@/components/business/ConseilDuJour";

export default function AppHome() {
  const router = useRouter();
  const business = useBusiness();
  const offers = useOffers();
  const [situation, setSituation] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (ready && !business) router.replace("/app/onboarding");
  }, [ready, business, router]);

  if (!ready || !business) return null;

  const typeDef = getBusinessType(business.type);

  function go(text: string, objective = "sell_today") {
    const t = text.trim();
    router.push(
      `/app/today?objective=${objective}${t ? `&intention=${encodeURIComponent(t)}` : ""}`,
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <header>
        <p className="text-[0.9375rem] text-ink-soft">Bonjour {business.name}</p>
        <h1 className="font-display text-2xl font-semibold">Votre commerce est prêt.</h1>
      </header>

      {/* Entrée principale : la situation du commerçant */}
      <Card className="bg-surface">
        <h2 className="font-display text-xl font-semibold">
          Que voulez-vous vendre aujourd&apos;hui ?
        </h2>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">
          Dites votre situation. Lumivao propose la meilleure offre.
        </p>
        <div className="mt-4">
          <Textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder={`Ex : ${typeDef.examples[0]}  ·  « J'ai trop de boissons aujourd'hui »`}
          />
        </div>
        <Button className="mt-3" block onClick={() => go(situation)} disabled={!situation.trim()}>
          Trouver la bonne offre
        </Button>
      </Card>

      {/* Conseil du jour — conseiller commercial invisible */}
      <ConseilDuJour business={business} />

      {/* Actions utiles */}
      <section>
        <h2 className="mb-1 font-display text-lg font-semibold">Actions utiles</h2>
        <p className="mb-3 text-[0.9375rem] text-ink-soft">
          Choisissez l&apos;action, nous préparons les supports.
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {USEFUL_ACTIONS.map((a) => (
            <Card
              key={a.label}
              interactive
              onClick={() => go(a.intention, a.objective)}
              className="bg-surface"
            >
              <p className="font-medium text-ink">{a.label}</p>
              <p className="mt-0.5 text-sm text-ink-soft">{a.hint}</p>
            </Card>
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
