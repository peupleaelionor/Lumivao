"use client";

import { useEffect, useMemo, useState } from "react";
import { useBusiness, useOffers, useProducts } from "@/lib/store/use-store";
import { getLatestPublishedOffer } from "@/lib/store/local-store";
import { PublicBusinessCard } from "@/components/public/PublicBusinessCard";
import type { Offer } from "@/types";

/**
 * Mini-vitrine publique. En mode démo, les données viennent du magasin
 * local du navigateur. En production, brancher /api/public/business.
 */
export default function PublicPage({ params }: { params: { slug: string } }) {
  const business = useBusiness();
  const products = useProducts();
  const offers = useOffers();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const offer: Offer | null = useMemo(
    () => getLatestPublishedOffer(),
    // recalcul quand la liste change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offers.length],
  );

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : `https://lumivao.app/app/public/${params.slug}`;

  if (!ready) return null;

  if (!business || business.slug !== params.slug) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-center">
        <div>
          <p className="font-display text-lg font-semibold">Vitrine introuvable</p>
          <p className="mt-1 text-[0.9375rem] text-ink-soft">
            Cette vitrine n&apos;est pas disponible sur cet appareil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      <PublicBusinessCard
        business={business}
        offer={offer}
        products={products.filter((p) => p.active)}
        shareUrl={shareUrl}
      />
    </div>
  );
}
