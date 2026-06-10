import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { QRBlock } from "@/components/qr/QRBlock";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import { getBusinessType } from "@/data/business-types";
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
  const waMessage = offer
    ? offer.whatsappMessage
    : `Bonjour ${business.name}, je vous contacte via votre vitrine LUMIVAO.`;
  const waLink = buildWhatsAppLink(business.whatsapp || business.phone || "", waMessage);
  const typeDef = getBusinessType(business.type);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-8">
      <header className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-ink text-2xl">
          {business.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.logoUrl} alt="" className="h-full w-full rounded-lg object-cover" />
          ) : (
            typeDef.emoji
          )}
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold text-ink">{business.name}</h1>
          <p className="truncate text-sm text-ink-soft">
            {typeDef.label}
            {business.city ? ` · ${business.city}` : ""}
          </p>
        </div>
        {business.openingHours && (
          <span className="ml-auto flex-none">
            <Badge tone="published">Ouvert</Badge>
          </span>
        )}
      </header>

      {offer && (
        <Card className="border-green/30 bg-green-tint/40">
          <span className="text-xs font-semibold uppercase tracking-wide text-green-dense">
            Offre du jour
          </span>
          <h2 className="mt-1 font-display text-lg font-semibold text-ink">{offer.title}</h2>
          <p className="mt-1 text-[0.9375rem] text-ink-soft">{offer.description}</p>
          {offer.newPrice != null && (
            <p className="mt-2 font-display text-2xl font-semibold text-orange-dense">
              {formatPrice(offer.newPrice)}
            </p>
          )}
        </Card>
      )}

      {products.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-ink">Nos produits</h3>
          <div className="flex flex-col gap-2">
            {products.slice(0, 8).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded border border-line bg-surface px-4 py-3"
              >
                <span className="text-[0.9375rem] text-ink">{p.name}</span>
                {p.price != null && (
                  <span className="text-sm font-medium text-ink-soft">{formatPrice(p.price)}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[52px] items-center justify-center rounded bg-green text-base font-semibold text-ink hover:bg-green-dense hover:text-cream"
      >
        Commander sur WhatsApp
      </a>

      <div className="grid gap-1 text-sm text-ink-soft">
        {business.address && <p>📍 {business.address}</p>}
        {business.openingHours && <p>🕒 {business.openingHours}</p>}
      </div>

      <div className="flex flex-col items-center gap-2 pt-2">
        <QRBlock data={shareUrl} label="Scanner pour partager cette vitrine" size={160} />
      </div>
    </div>
  );
}
