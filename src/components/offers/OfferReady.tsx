"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Business, EngineOffer } from "@/types";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { QRBlock } from "@/components/qr/QRBlock";
import { SuccessMessage } from "@/components/ui/States";
import { FlyerPreview, type FlyerFormat } from "@/components/flyers/FlyerPreview";
import {
  A4Icon,
  IconBubble,
  InstagramIcon,
  StoreIcon,
  TicketIcon,
  WhatsAppIcon,
} from "@/components/ui/Icons";

type RowAction = { label: string; onClick: () => void };

/** Écran « Votre offre est prête » — hero + supports à partager. */
export function OfferReady({
  business,
  offer,
  publicUrl,
  published,
  onPublish,
  onModify,
}: {
  business: Business;
  offer: EngineOffer;
  publicUrl: string;
  published: boolean;
  onPublish: () => void;
  onModify: () => void;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState<FlyerFormat | null>(null);

  function copyMessage() {
    navigator.clipboard.writeText(offer.whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const waLink = buildWhatsAppLink(business.whatsapp || "", offer.whatsappMessage);

  const rows: { key: string; icon: React.ReactNode; label: string; action: RowAction }[] = [
    {
      key: "wa",
      icon: <IconBubble tone="green"><WhatsAppIcon /></IconBubble>,
      label: "Message WhatsApp",
      action: { label: copied ? "Copié ✓" : "Copier", onClick: copyMessage },
    },
    {
      key: "shop",
      icon: <IconBubble tone="orange"><StoreIcon /></IconBubble>,
      label: "Mini-vitrine",
      action: { label: "Ouvrir", onClick: () => window.open(`/app/public/${business.slug}`, "_blank") },
    },
    {
      key: "story",
      icon: <IconBubble tone="instagram"><InstagramIcon /></IconBubble>,
      label: "Story Instagram",
      action: { label: "Voir", onClick: () => setPreview("story") },
    },
    {
      key: "a4",
      icon: <IconBubble tone="orange"><A4Icon /></IconBubble>,
      label: "Affiche A4",
      action: { label: "Télécharger", onClick: () => setPreview("a4") },
    },
    {
      key: "loyalty",
      icon: <IconBubble tone="green"><TicketIcon /></IconBubble>,
      label: "Coupon fidélité",
      action: { label: "Activer", onClick: () => router.push("/app/customers") },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-semibold">Votre offre est prête</h1>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">Tout est prêt à partager.</p>
      </div>

      {published && <SuccessMessage>Votre offre est publiée.</SuccessMessage>}

      {/* Hero offre */}
      <div className="rounded-xl border border-green/25 bg-gradient-to-br from-green-tint/70 to-surface p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-semibold leading-tight">{offer.name}</h2>
            {offer.bestTime && (
              <p className="mt-0.5 text-[0.9375rem] font-medium text-green-dense">
                {offer.strategy === "vente_rapide" ? "Aujourd'hui seulement" : offer.bestTime}
              </p>
            )}
            <p className="mt-2 font-display text-[2.5rem] font-semibold leading-none text-green-dense">
              {offer.price}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <QRBlock data={publicUrl} label="" size={120} className="p-1.5" />
          <span className="text-sm text-ink-soft">Scanner pour commander</span>
        </div>
      </div>

      {/* Supports à partager */}
      <section>
        <h3 className="mb-3 font-display text-lg font-semibold">Partagez votre offre</h3>
        <div className="flex flex-col gap-2.5">
          {rows.map((r) => (
            <div
              key={r.key}
              className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5"
            >
              {r.icon}
              <span className="flex-1 font-medium text-ink">{r.label}</span>
              <button
                onClick={r.action.onClick}
                className="rounded-full border border-green/40 px-4 py-1.5 text-sm font-medium text-green-dense transition hover:bg-green-tint"
              >
                {r.action.label}
              </button>
            </div>
          ))}
        </div>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-3 block">
          <Button variant="accent" block>
            Partager sur WhatsApp
          </Button>
        </a>
      </section>

      {/* Aperçu flyer (story / A4) à la demande */}
      {preview && (
        <FlyerPreview
          data={{
            businessName: business.name,
            headline: offer.flyerHeadline,
            description: offer.reason,
            price: offer.price,
            cta: offer.cta,
            qrData: publicUrl,
          }}
          format={preview}
        />
      )}

      <div className="flex flex-col gap-2">
        {!published ? (
          <Button block onClick={onPublish}>
            Publier maintenant
          </Button>
        ) : (
          <Button block onClick={() => router.push(`/app/tv/${business.id}`)}>
            Afficher sur TV
          </Button>
        )}
        <Button variant="secondary" block onClick={onModify}>
          Modifier l&apos;offre
        </Button>
      </div>
    </div>
  );
}
