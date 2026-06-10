"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBusiness, useProducts } from "@/lib/store/use-store";
import { saveOffer } from "@/lib/store/local-store";
import { getBusinessType } from "@/data/business-types";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn, slugify } from "@/lib/utils";
import type { AiOfferResponse, GeneratedOffer } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { LoadingState, SuccessMessage } from "@/components/ui/States";
import { FlyerPreview } from "@/components/flyers/FlyerPreview";
import { QRBlock } from "@/components/qr/QRBlock";

const TONE_LABEL: Record<GeneratedOffer["type"], string> = {
  prudent: "Prudente",
  aggressive: "Agressive",
  premium: "Premium",
};

function parsePrice(text: string): number | null {
  const m = text.match(/(\d+[.,]?\d*)/);
  if (!m) return null;
  return Number.parseFloat(m[1]!.replace(",", "."));
}

function TodayInner() {
  const router = useRouter();
  const params = useSearchParams();
  const business = useBusiness();
  const products = useProducts();

  const [intention, setIntention] = useState(params.get("intention") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiOfferResponse | null>(null);
  const [selected, setSelected] = useState<GeneratedOffer | null>(null);
  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.get("intention") && intention && !result) {
      void generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appUrl = useMemo(
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    [],
  );
  const publicUrl = business ? `${appUrl}/app/public/${business.slug}` : "";

  async function generate() {
    if (!business || intention.trim().length < 3) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSelected(null);
    setPublished(false);
    try {
      const res = await fetch("/api/ai/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: business.type,
          businessName: business.name,
          products: products.map((p) => ({ name: p.name, price: p.price ?? undefined })),
          intention: intention.trim(),
          objective: "sell_today",
          language: "fr",
        }),
      });
      const data = (await res.json()) as AiOfferResponse | { error: string };
      if (!res.ok || !("offers" in data)) {
        setError(("error" in data && data.error) || "Impossible de préparer l'offre.");
        return;
      }
      setResult(data);
    } catch {
      setError("Impossible de terminer. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  function publish(offer: GeneratedOffer) {
    if (!business) return;
    const newPrice = parsePrice(offer.suggestedPrice);
    saveOffer({
      businessId: business.id,
      productId: null,
      title: offer.title,
      description: offer.shortText,
      newPrice,
      oldPrice: null,
      goal: "sell_today",
      channel: "whatsapp",
      status: "published",
      tone: offer.type,
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
  const waLink = selected
    ? buildWhatsAppLink(business.whatsapp || "", selected.whatsappMessage)
    : "";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Offre du jour</h1>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">
          Décrivez votre offre. Nous préparons vos supports.
        </p>
      </header>

      <Card className="bg-surface">
        <Textarea
          label="Décrivez votre offre"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder={`Ex : ${typeDef.examples[0]}`}
        />
        <Button className="mt-4" block onClick={generate} disabled={loading || intention.trim().length < 3}>
          {loading ? "Préparation…" : "Préparer mes supports"}
        </Button>
        {error && (
          <p className="mt-3 rounded bg-orange-tint px-3 py-2 text-sm text-orange-dense">{error}</p>
        )}
      </Card>

      {loading && <LoadingState />}

      {/* 3 offres proposées */}
      {result && !selected && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Choisissez une offre</h2>
            {result.source === "local" && (
              <span className="text-xs text-ink-soft">Mode hors-ligne</span>
            )}
          </div>
          {result.offers.map((o) => (
            <Card key={o.type} interactive onClick={() => setSelected(o)} className="bg-surface">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display font-semibold">{o.title}</h3>
                <Badge tone={o.type === "premium" ? "promo" : o.type === "aggressive" ? "new" : "neutral"}>
                  {TONE_LABEL[o.type]}
                </Badge>
              </div>
              <p className="mt-1.5 text-[0.9375rem] text-ink-soft">{o.shortText}</p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-orange-dense">{o.suggestedPrice}</span>
                <span className="text-ink-soft">{o.reason}</span>
              </div>
            </Card>
          ))}
        </section>
      )}

      {/* Supports prêts pour l'offre sélectionnée */}
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

          <FlyerPreview
            data={{
              businessName: business.name,
              headline: selected.flyerHeadline,
              description: selected.shortText,
              price: selected.suggestedPrice,
              cta: selected.cta,
              qrData: publicUrl,
            }}
            format="square"
          />

          {/* Message WhatsApp */}
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

          {/* QR + mini-page */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="flex flex-col items-center gap-3 bg-surface">
              <h3 className="self-start font-medium">QR code commande</h3>
              <QRBlock data={publicUrl} label="Scanner pour commander" size={180} />
            </Card>
            <Card className="flex flex-col gap-3 bg-surface">
              <h3 className="font-medium">Mini-vitrine</h3>
              <p className="text-sm text-ink-soft break-all">{publicUrl}</p>
              <div className="mt-auto flex flex-col gap-2">
                <Button
                  variant="secondary"
                  onClick={() => navigator.clipboard.writeText(publicUrl)}
                >
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

          {!published && (
            <Button block onClick={() => publish(selected)}>
              Publier maintenant
            </Button>
          )}
          {published && (
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
