"use client";

import { QRBlock } from "@/components/qr/QRBlock";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import { getBusinessType } from "@/data/business-types";
import {
  ClockIcon,
  IconBubble,
  LinkIcon,
  PinIcon,
  SparkleIcon,
  StoreIcon,
  TagIcon,
} from "@/components/ui/Icons";
import type { Business, Offer, Product } from "@/types";

/** Carte vitrine publique — réutilisée par /public/[slug]. */
export function PublicBusinessCard({
  business,
  offer,
  products,
  shareUrl,
}: {
  business: Business;
  offer: Offer | null;
  products: Product[];
  shareUrl: string;
}) {
  const typeDef = getBusinessType(business.type);
  const waMessage = offer
    ? offer.whatsappMessage
    : `Bonjour ${business.name}, je vous contacte via votre vitrine LUMIVAO.`;
  const waLink = buildWhatsAppLink(business.whatsapp || business.phone || "", waMessage);

  function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      void navigator.share({ title: business.name, url: shareUrl });
    } else {
      void navigator.clipboard?.writeText(shareUrl);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5 px-4 pb-24 pt-6">
      {/* En-tête commerce */}
      <header className="flex items-center gap-3">
        <div className="flex h-16 w-16 flex-none items-center justify-center rounded-xl border border-line bg-surface text-orange">
          {business.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.logoUrl} alt="" className="h-full w-full rounded-xl object-cover" />
          ) : (
            <StoreIcon className="h-8 w-8" />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold leading-tight text-ink">{business.name}</h1>
          {business.openingHours && (
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-tint px-2.5 py-1 text-[0.8125rem] font-medium text-green-dense">
              <span className="h-1.5 w-1.5 rounded-full bg-green-dense" />
              Ouvert aujourd&apos;hui
            </span>
          )}
          <p className="mt-1 flex items-center gap-3 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <TagIcon className="h-4 w-4" /> {typeDef.label}
            </span>
            {business.city && (
              <span className="inline-flex items-center gap-1">
                <PinIcon className="h-4 w-4" /> {business.city}
              </span>
            )}
          </p>
        </div>
      </header>

      {/* Offre du jour */}
      {offer && (
        <section className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="flex items-stretch gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-orange-dense">
                <SparkleIcon className="h-4 w-4" /> Offre du jour
              </p>
              <h2 className="mt-1 font-display text-xl font-semibold leading-tight text-ink">
                {offer.title}
              </h2>
              {offer.newPrice != null && (
                <p className="mt-1 font-display text-2xl font-semibold text-green-dense">
                  {formatPrice(offer.newPrice)}
                </p>
              )}
              <p className="mt-1 text-sm text-ink-soft line-clamp-2">{offer.description}</p>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-11 items-center justify-center rounded bg-ink px-4 text-sm font-medium text-cream"
              >
                Commander sur WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Produits */}
      {products.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Nos produits</h3>
          </div>
          <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
            {products.slice(0, 10).map((p) => (
              <div key={p.id} className="w-32 flex-none rounded-lg border border-line bg-surface p-2">
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded bg-cream text-2xl">
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    typeDef.emoji
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-medium text-ink">{p.name}</p>
                {p.price != null && (
                  <p className="text-sm font-semibold text-green-dense">{formatPrice(p.price)}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Informations utiles */}
      <section>
        <h3 className="mb-2 font-display text-lg font-semibold">Informations utiles</h3>
        <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">
          <ul className="min-w-0 flex-1 space-y-3">
            {business.openingHours && (
              <li className="flex items-center gap-3">
                <IconBubble tone="green" className="h-9 w-9"><ClockIcon /></IconBubble>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink">Horaires</span>
                  <span className="block truncate text-sm text-ink-soft">{business.openingHours}</span>
                </span>
              </li>
            )}
            {business.address && (
              <li className="flex items-center gap-3">
                <IconBubble tone="green" className="h-9 w-9"><PinIcon /></IconBubble>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink">Adresse</span>
                  <span className="block truncate text-sm text-ink-soft">{business.address}</span>
                </span>
              </li>
            )}
            <li className="flex items-center gap-3">
              <IconBubble tone="green" className="h-9 w-9"><LinkIcon /></IconBubble>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">Lien public</span>
                <span className="block text-sm text-green-dense">Lien public prêt</span>
              </span>
            </li>
          </ul>
          <div className="flex-none text-center">
            <QRBlock data={shareUrl} label="" size={96} className="p-1.5" />
            <span className="mt-1 block text-[0.6875rem] leading-tight text-ink-soft">
              Scanner pour<br />voir la boutique
            </span>
          </div>
        </div>
      </section>

      {/* Partage */}
      <button
        onClick={share}
        className="fixed inset-x-0 bottom-0 z-10 mx-auto flex h-[52px] max-w-md items-center justify-center gap-2 rounded-t-xl bg-green px-4 text-base font-semibold text-ink"
      >
        Partager la vitrine
      </button>
    </div>
  );
}
