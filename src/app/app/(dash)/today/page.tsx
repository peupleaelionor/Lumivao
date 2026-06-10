"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBusiness, useProducts } from "@/lib/store/use-store";
import { saveOffer } from "@/lib/store/local-store";
import { getBusinessType } from "@/data/business-types";
import { STRATEGY_LABEL } from "@/lib/offers/offer-score";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type {
  AdvisorObjective,
  EngineBadge,
  EngineOffer,
  EngineStrategy,
  OfferEngineResponse,
  OfferToneKey,
} from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { LoadingState, SuccessMessage } from "@/components/ui/States";
import { FlyerPreview } from "@/components/flyers/FlyerPreview";
import { QRBlock } from "@/components/qr/QRBlock";

const BADGE_TONE: Record<EngineBadge, "published" | "new" | "draft"> = {
  Recommandée: "published",
  Solide: "new",
  "À ajuster": "draft",
};

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
  const [copied, setCopied] = useState(false);

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
  const waLink = selected ? buildWhatsAppLink(business.whatsapp || "", selected.whatsappMessage) : "";

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
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Voici les meilleures offres pour aujourd&apos;hui
            </h2>
            <p className="text-[0.9375rem] text-ink-soft">
              Choisissez une option. Lumivao prépare les supports.
            </p>
          </div>
          {result.offers.map((o, i) => {
            const recommended = i + 1 === result.recommendedOfferRank;
            return (
              <Card
                key={o.strategy}
                interactive
                onClick={() => setSelected(o)}
                className={cn("bg-surface", recommended && "border-green/40")}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    {STRATEGY_LABEL[o.strategy]}
                  </span>
                  <Badge tone={recommended ? "published" : BADGE_TONE[o.badge]}>
                    {recommended
                      ? "Meilleure option aujourd'hui"
                      : o.badge === "Recommandée"
                        ? "Solide"
                        : o.badge}
                  </Badge>
                </div>
                <h3 className="mt-1.5 font-display font-semibold leading-snug">{o.name}</h3>
                <div className="mt-2 grid gap-1 text-[0.8125rem] text-ink-soft">
                  <p className="text-base font-semibold text-orange-dense">{o.price}</p>
                  <p>🎯 {o.target}</p>
                  <p>📣 {o.channel}{o.bestTime ? ` · ${o.bestTime}` : ""}</p>
                  {o.reason && <p>💬 {o.reason}</p>}
                </div>
                <Button className="mt-3" variant={recommended ? "primary" : "secondary"} block>
                  Préparer cette offre
                </Button>
              </Card>
            );
          })}
        </section>
      )}

      {/* Supports de l'offre choisie */}
      {selected && (
        <section className="flex flex-col gap-5">
          {published ? (
            <SuccessMessage>Votre offre est prête.</SuccessMessage>
          ) : (
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Vos supports</h2>
              <button onClick={() => setSelected(null)} className="text-sm text-ink-soft hover:text-ink">
                Changer d&apos;offre
              </button>
            </div>
          )}

          {selected.marginAdvice && (
            <p className="rounded bg-cream px-3 py-2 text-sm text-ink-soft">
              💡 {selected.marginAdvice}
            </p>
          )}

          <FlyerPreview
            data={{
              businessName: business.name,
              headline: selected.flyerHeadline,
              description: selected.reason,
              price: selected.price,
              cta: selected.cta,
              qrData: publicUrl,
            }}
            format="square"
          />

          <Card className="bg-surface">
            <h3 className="font-medium">Message WhatsApp</h3>
            <p className="mt-2 whitespace-pre-line rounded border border-line bg-cream p-3 text-sm">
              {selected.whatsappMessage}
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard.writeText(selected.whatsappMessage);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "Copié ✓" : "Copier le message"}
              </Button>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="accent" block>
                  Partager sur WhatsApp
                </Button>
              </a>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="flex flex-col items-center gap-3 bg-surface">
              <h3 className="self-start font-medium">QR code commande</h3>
              <QRBlock data={publicUrl} label="Scanner pour commander" size={180} />
            </Card>
            <Card className="flex flex-col gap-3 bg-surface">
              <h3 className="font-medium">Mini-vitrine</h3>
              <p className="break-all text-sm text-ink-soft">{publicUrl}</p>
              <div className="mt-auto flex flex-col gap-2">
                <Button variant="secondary" onClick={() => navigator.clipboard.writeText(publicUrl)}>
                  Copier le lien
                </Button>
                <a href={`/app/public/${business.slug}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" block>
                    Ouvrir la page
                  </Button>
                </a>
              </div>
            </Card>
          </div>

          {!published ? (
            <Button block onClick={() => publish(selected)}>
              Publier maintenant
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" block onClick={() => router.push("/app/flyers")}>
                Voir mes offres
              </Button>
              <Button block onClick={() => router.push(`/app/tv/${business.id}`)}>
                Afficher sur TV
              </Button>
            </div>
          )}
        </section>
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
