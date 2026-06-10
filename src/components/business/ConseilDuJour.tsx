"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdvisorResponse, Business, TimeOfDay } from "@/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/States";

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
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-3 h-5 w-full" />
        <Skeleton className="mt-2 h-5 w-2/3" />
        <Skeleton className="mt-4 h-11 w-full" />
      </Card>
    );
  }

  if (!data) return null;
  const action = data.actions[0];

  function prepare() {
    if (!action) return;
    const intention = `${action.title} — ${action.offer}`;
    router.push(`/app/today?intention=${encodeURIComponent(intention)}&objective=sell_today`);
  }

  return (
    <Card className="border-green/30 bg-green-tint/30">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-green-dense">
          Conseil du jour
        </span>
        {data.diagnosis.recommendedFocus && (
          <Badge tone="published">{data.diagnosis.recommendedFocus}</Badge>
        )}
      </div>

      <p className="mt-2 font-display text-[1.0625rem] font-semibold leading-snug">
        {data.diagnosis.summary || data.diagnosis.mainOpportunity}
      </p>

      {action && (
        <div className="mt-3 rounded border border-line bg-cream p-3 text-sm">
          <p className="font-medium text-ink">{action.title}</p>
          <p className="mt-0.5 text-ink-soft">{action.offer}</p>
          <ul className="mt-2 grid gap-1 text-[0.8125rem] text-ink-soft">
            <li>🎯 Cible : {action.targetCustomer}</li>
            <li>📣 {action.bestChannel}{action.bestTime ? ` · ${action.bestTime}` : ""}</li>
            {action.marginAdvice && <li>💡 {action.marginAdvice}</li>}
          </ul>
        </div>
      )}

      <Button className="mt-4" block onClick={prepare}>
        Préparer cette action
      </Button>
      <p className="mt-2 text-center text-xs text-ink-soft">
        Vous validez toujours avant de publier.
      </p>
    </Card>
  );
}
