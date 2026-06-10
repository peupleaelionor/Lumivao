"use client";

import { useEffect, useMemo, useState } from "react";
import { useBusiness, useOffers } from "@/lib/store/use-store";
import { getLatestPublishedOffer } from "@/lib/store/local-store";
import { formatPrice } from "@/lib/utils";

/**
 * Affichage TV plein écran : offre du jour, prix, QR, nom du commerce.
 * Contraste élevé, lisible de loin (caisse, salle, vitrine).
 */
export default function TvPage({ params }: { params: { businessId: string } }) {
  const business = useBusiness();
  const offers = useOffers();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const offer = useMemo(
    () => getLatestPublishedOffer(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offers.length],
  );

  const url =
    business && typeof window !== "undefined"
      ? `${window.location.origin}/app/public/${business.slug}`
      : "";

  if (!ready) return null;

  if (!business) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ink text-cream">
        <p className="text-xl">Aucun écran connecté.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-ink px-8 py-12 text-center text-cream">
      <p className="text-2xl font-semibold uppercase tracking-[0.1em] text-green">
        {business.name}
      </p>

      {offer ? (
        <>
          <h1 className="max-w-4xl font-display text-[clamp(2.5rem,8vw,6rem)] font-semibold leading-[1.02] whitespace-pre-line">
            {offer.flyerHeadline || offer.title}
          </h1>
          {offer.newPrice != null && (
            <p className="font-display text-[clamp(3rem,12vw,9rem)] font-semibold leading-none text-orange">
              {formatPrice(offer.newPrice)}
            </p>
          )}
          <p className="max-w-2xl text-[clamp(1.25rem,3vw,2rem)] text-cream/80">{offer.description}</p>
        </>
      ) : (
        <h1 className="font-display text-4xl font-semibold">Offre du jour à venir</h1>
      )}

      {url && (
        <div className="mt-2 flex flex-col items-center gap-3 rounded-lg bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/qr?data=${encodeURIComponent(url)}&size=320`}
            alt="QR commande"
            className="h-44 w-44"
          />
          <span className="text-base font-medium text-ink">Scanner pour commander</span>
        </div>
      )}
    </div>
  );
}
