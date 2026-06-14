"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdvisorResponse, Business, TimeOfDay } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/States";
import { BulbIcon, IconBubble } from "@/components/ui/Icons";

function currentTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h < 11) return "matin";
  if (h < 14) return "midi";
  if (h < 18) return "apres_midi";
  return "soir";
}

/**
 * « Conseil du jour » — visage du conseiller commercial invisible.
 * Affiche un diagnostic court + l'action recommandée, prête à préparer.
 */
export function ConseilDuJour({ business }: { business: Business }) {
  const router = useRouter();
  const [data, setData] = useState<AdvisorResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/ai/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessType: business.type,
            businessName: business.name,
            city: business.city ?? undefined,
            objective: "sell_today",
            timeOfDay: currentTimeOfDay(),
          }),
        });
        const json = (await res.json()) as AdvisorResponse;
        if (active && "actions" in json) setData(json);
      } catch {
        /* le fallback est géré côté serveur ; on n'affiche rien si tout échoue */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [business.type, business.name, business.city]);

  if (loading) {
    return (
      <Card className="bg-surface">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        </div>
      </Card>
    );
  }

  if (!data) return null;
  const action = data.actions[0];
  const advice = data.diagnosis.mainOpportunity || data.diagnosis.summary;

  function prepare() {
    if (!action) return;
    const intention = `${action.title} — ${action.offer}`;
    router.push(`/app/today?intention=${encodeURIComponent(intention)}&objective=sell_today`);
  }

  return (
    <Card className="bg-surface">
      <div className="flex items-center gap-4">
        <IconBubble tone="green">
          <BulbIcon />
        </IconBubble>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold text-ink">Conseil du jour</p>
          <p className="mt-0.5 text-[0.9375rem] leading-snug text-ink-soft">{advice}</p>
        </div>
        <Button variant="accent" size="sm" className="flex-none" onClick={prepare}>
          Préparer cette action
        </Button>
      </div>
      <p className="mt-3 text-xs text-ink-soft">Vous validez toujours avant de publier.</p>
    </Card>
  );
}
