"use client";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Offer } from "@/types";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short" });

export function OfferCard({
  offer,
  onView,
  onShare,
}: {
  offer: Offer;
  onView?: () => void;
  onShare?: () => void;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold text-ink leading-snug">{offer.title}</h3>
        <Badge tone={offer.status === "published" ? "published" : "draft"}>
          {offer.status === "published" ? "Publiée" : "Brouillon"}
        </Badge>
      </div>
      <p className="text-[0.9375rem] text-ink-soft line-clamp-2">{offer.description}</p>
      <div className="flex items-center gap-2 text-sm">
        {offer.newPrice != null && (
          <span className="font-semibold text-orange-dense">
            {offer.newPrice.toFixed(2).replace(".", ",")} €
          </span>
        )}
        {offer.oldPrice != null && (
          <span className="text-ink-soft line-through">
            {offer.oldPrice.toFixed(2).replace(".", ",")} €
          </span>
        )}
        <span className="ml-auto text-xs text-ink-soft">
          {dateFmt.format(new Date(offer.createdAt))}
        </span>
      </div>
      <div className="mt-1 flex gap-2">
        {onView && (
          <button
            onClick={onView}
            className="flex-1 h-10 rounded border border-line bg-surface text-sm font-medium hover:border-ink"
          >
            Voir
          </button>
        )}
        {onShare && (
          <button
            onClick={onShare}
            className="flex-1 h-10 rounded bg-green text-ink text-sm font-semibold hover:bg-green-dense hover:text-cream"
          >
            Partager
          </button>
        )}
      </div>
    </Card>
  );
}
