"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { cn, slugify } from "@/lib/utils";
import { QRBlock } from "@/components/qr/QRBlock";
import { Button } from "@/components/ui/Button";

export type FlyerFormat = "square" | "story" | "a4";

export interface FlyerData {
  businessName: string;
  headline: string;
  description?: string;
  price?: string;
  oldPrice?: string;
  cta?: string;
  qrData?: string;
}

const FORMAT_RATIO: Record<FlyerFormat, string> = {
  square: "aspect-square",
  story: "aspect-[9/16]",
  a4: "aspect-[210/297]",
};

/**
 * Flyer MVP : carte HTML propre, lisible en 2 secondes.
 * Exportable en PNG via html-to-image (pas d'éditeur complexe).
 */
export function FlyerPreview({
  data,
  format = "square",
  className,
}: {
  data: FlyerData;
  format?: FlyerFormat;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  async function download() {
    if (!ref.current) return;
    setBusy(true);
    try {
      const url = await toPng(ref.current, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = url;
      a.download = `flyer-${slugify(data.businessName || "lumivao")}.png`;
      a.click();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-lg border border-line bg-cream p-6 flex flex-col",
          FORMAT_RATIO[format],
        )}
      >
        <span className="text-[0.8125rem] font-semibold uppercase tracking-wide text-green-dense">
          {data.businessName}
        </span>

        <div className="flex-1 flex flex-col justify-center gap-3 py-4">
          <h3 className="font-display font-semibold text-ink leading-tight text-[clamp(1.5rem,6vw,2.25rem)] whitespace-pre-line">
            {data.headline}
          </h3>
          {data.description && (
            <p className="text-[0.9375rem] text-ink-soft line-clamp-3">{data.description}</p>
          )}
          {data.price && (
            <div className="flex items-baseline gap-2">
              <span className="font-display font-semibold text-orange-dense text-[clamp(1.75rem,7vw,2.75rem)]">
                {data.price}
              </span>
              {data.oldPrice && (
                <span className="text-ink-soft line-through text-lg">{data.oldPrice}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-3">
          <span className="inline-flex h-10 items-center rounded bg-ink px-4 text-sm font-medium text-cream">
            {data.cta || "Commander sur WhatsApp"}
          </span>
          {data.qrData && <QRBlock data={data.qrData} label="" size={120} className="p-1.5" />}
        </div>
      </div>

      <Button variant="secondary" onClick={download} disabled={busy} block>
        {busy ? "Préparation…" : "Télécharger le flyer"}
      </Button>
    </div>
  );
}
