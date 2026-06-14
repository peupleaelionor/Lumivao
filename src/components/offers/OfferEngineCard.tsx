"use client";

import type { EngineOffer, EngineStrategy } from "@/types";
import { STRATEGY_LABEL } from "@/lib/offers/offer-score";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  BoltIcon,
  ClockIcon,
  CrownIcon,
  EuroIcon,
  PersonIcon,
  SparkleIcon,
  StarIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";

const STRATEGY_HEAD: Record<EngineStrategy, { icon: React.ReactNode; color: string }> = {
  marge_protegee: { icon: <StarIcon className="h-4 w-4" />, color: "text-green-dense" },
  vente_rapide: { icon: <BoltIcon className="h-4 w-4" />, color: "text-orange-dense" },
  panier_premium: { icon: <CrownIcon className="h-4 w-4" />, color: "text-orange-dense" },
};

function Cell({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-green-dense">
        <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
        <span className="truncate text-[0.625rem] uppercase tracking-wide text-ink-soft">{label}</span>
      </div>
      <p className="mt-0.5 text-[0.8125rem] font-medium leading-tight text-ink">{value || "—"}</p>
    </div>
  );
}

export function OfferEngineCard({
  offer,
  recommended,
  onPrepare,
}: {
  offer: EngineOffer;
  recommended: boolean;
  onPrepare: () => void;
}) {
  const head = STRATEGY_HEAD[offer.strategy];
  return (
    <div
      className={cn(
        "rounded-xl border bg-surface p-5",
        recommended ? "border-green/40 shadow-soft" : "border-line",
      )}
    >
      {recommended && (
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-green-tint px-3 py-1 text-xs font-semibold text-green-dense">
          <StarIcon className="h-3.5 w-3.5" />
          Recommandée
        </span>
      )}

      <div className={cn("flex items-center gap-1.5 text-[0.8125rem] font-semibold", head.color)}>
        {head.icon}
        {STRATEGY_LABEL[offer.strategy]}
      </div>

      <div className="mt-1 flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold leading-snug">{offer.name}</h3>
        {/\d/.test(offer.price) && (
          <span className="flex-none font-display text-xl font-semibold text-ink">{offer.price}</span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 border-y border-line py-3">
        <Cell icon={<PersonIcon />} label="Cible" value={offer.target} />
        <Cell icon={<WhatsAppIcon />} label="Canal" value={offer.channel} />
        <Cell icon={<ClockIcon />} label="Moment" value={offer.bestTime} />
        <Cell icon={<EuroIcon />} label="Prix" value={offer.price} />
      </div>

      {offer.reason && (
        <div className="mt-3 flex items-start gap-2">
          <SparkleIcon className="mt-0.5 h-4 w-4 flex-none text-orange" />
          <p className="text-[0.9375rem] text-ink-soft">
            <span className="font-medium text-ink">Pourquoi ? </span>
            {offer.reason}
          </p>
        </div>
      )}

      <Button className="mt-4" variant={recommended ? "primary" : "secondary"} block onClick={onPrepare}>
        Préparer cette offre
      </Button>
    </div>
  );
}
