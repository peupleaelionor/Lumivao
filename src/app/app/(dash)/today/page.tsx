"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBusiness, useProducts } from "@/lib/store/use-store";
import { saveOffer } from "@/lib/store/local-store";
import { getBusinessType } from "@/data/business-types";
import type {
  AdvisorObjective,
  EngineOffer,
  EngineStrategy,
  OfferEngineResponse,
  OfferToneKey,
} from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { LoadingState } from "@/components/ui/States";
import { OfferEngineCard } from "@/components/offers/OfferEngineCard";
import { OfferReady } from "@/components/offers/OfferReady";

const STRATEGY_TONE: Record<EngineStrategy, OfferToneKey> = {
  marge_protegee: "prudent",
  vente_rapide: "aggressive",
  panier_premium: "premium",
};

function parsePrice(text: string): number | null {
  const m = text.match(/(\d+[.,]?\d*)/);
  return m ? Number.parseFloat(m[1]!.replace(",", ".")) : null;
}

function currentTimeOfDay(): "matin" | "midi" | "apres_midi" | "soir" {
  const h = new Date().getHours();
  if (h < 11) return "matin";
  if (h < 14) return "midi";
  if (h < 18) return "apres_midi";
  return "soir";
}

function TodayInner() {
  const router = useRouter();
  const params = useSearchParams();
  const business = useBusiness();
  const products = useProducts();

  const [situation, setSituation] = useState(params.get("intention") ?? "");
  const objective = (params.get("objective") as AdvisorObjective | null) ?? "sell_today";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OfferEngineResponse | null>(null);
  const [selected, setSelected] = useState<EngineOffer | null>(null);
  const [published, setPublished] = useState(false);

  const appUrl = useMemo(() => (typeof window !== "undefined" ? window.location.origin : ""), []);
  const publicUrl = business ? `${appUrl}/app/public/${business.slug}` : "";

  async function generate() {
    if (!business || (situation.trim().length === 0 && !params.get("intention"))) {
      if (!business) return;
    }
    if (!business) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSelected(null);
    setPublished(false);
    try {
      const res = await fetch("/api/ai/offer-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: business.type,
          businessName: business.name,
          city: business.city ?? undefined,
          intention: situation.trim(),
          products: products.map((p) => ({ name: p.name, price: p.price ?? undefined })),
          objective,
          timeOfDay: currentTimeOfDay(),
        }),
      });
      const data = (await res.json()) as OfferEngineResponse | { error: string };
      if (!res.ok || !("offers" in data)) {
        setError(("error" in data && data.error) || "Impossible de préparer les offres.");
        return;
      }
      setResult(data);
    } catch {
      setError("Impossible de terminer. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  // Auto-lance si une intention/objectif arrive depuis l'accueil.
  useEffect(() => {
    if (params.get("intention") || params.get("objective")) void generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function publish(offer: EngineOffer) {
    if (!business) return;
    saveOffer({
      businessId: business.id,
      productId: null,
      title: offer.name,
      description: offer.reason,
      newPrice: parsePrice(offer.price),
      oldPrice: null,
      goal: "sell_today",
      channel: "whatsapp",
      status: "published",
      tone: STRATEGY_TONE[offer.strategy],
      whatsappMessage: offer.whatsappMessage,
      flyerHeadline: offer.flyerHeadline,
      cta: offer.cta,
    });
    setPublished(true);
  }

  if (!business) {
    return (
      <Card className="bg-surface text-center">
        <p>Créez d&apos;abord votre commerce.</p>
        <Button className="mt-4" onClick={() => router.push("/app/onboarding")}>
          Commencer
        </Button>
      </Card>
    );
  }

  const typeDef = getBusinessType(business.type);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Nouvelle action commerciale</h1>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">
          Dites votre situation. Lumivao propose la meilleure offre.
        </p>
      </header>

      <Card className="bg-surface">
        <Textarea
          label="Votre situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder={`Ex : ${typeDef.examples[0]}  ·  « J'ai trop de boissons aujourd'hui »`}
        />
        <Button className="mt-4" block onClick={generate} disabled={loading}>
          {loading ? "Recherche de la bonne offre…" : "Trouver la bonne offre"}
        </Button>
        {error && (
          <p className="mt-3 rounded bg-orange-tint px-3 py-2 text-sm text-orange-dense">{error}</p>
        )}
      </Card>

      {loading && <LoadingState label="Préparation de vos supports…" />}

      {/* 3 offres précises */}
      {result && !selected && (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Voici les meilleures offres pour aujourd&apos;hui
            </h2>
            <p className="text-[0.9375rem] text-ink-soft">
              Choisissez une option. Lumivao prépare les supports.
            </p>
          </div>
          {result.offers.map((o, i) => (
            <OfferEngineCard
              key={o.strategy}
              offer={o}
              recommended={i + 1 === result.recommendedOfferRank}
              onPrepare={() => setSelected(o)}
            />
          ))}
        </section>
      )}

      {/* Supports de l'offre choisie */}
      {selected && (
        <OfferReady
          business={business}
          offer={selected}
          publicUrl={publicUrl}
          published={published}
          onPublish={() => publish(selected)}
          onModify={() => {
            setSelected(null);
            setPublished(false);
          }}
        />
      )}
    </div>
  );
}

export default function TodayPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <TodayInner />
    </Suspense>
  );
}
