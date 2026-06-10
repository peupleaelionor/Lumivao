"use client";

import { useMemo } from "react";
import { useBusiness, useProducts } from "@/lib/store/use-store";
import { Card } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { QRBlock } from "@/components/qr/QRBlock";
import { EmptyState } from "@/components/ui/States";
import { formatPrice } from "@/lib/utils";

export default function MenuPage() {
  const business = useBusiness();
  const products = useProducts();

  const url = useMemo(
    () => (business && typeof window !== "undefined" ? `${window.location.origin}/app/public/${business.slug}` : ""),
    [business],
  );

  if (!business) return null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Menu QR</h1>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">
          Affichez votre menu en boutique. Toujours à jour, sans réimpression.
        </p>
      </header>

      <Card className="flex flex-col items-center gap-3 bg-surface text-center">
        <QRBlock data={url} label="Scanner pour voir le menu" size={200} />
        <div className="flex w-full gap-2">
          <Button variant="secondary" block onClick={() => navigator.clipboard.writeText(url)}>
            Partager le lien
          </Button>
          <a href={`/api/qr?data=${encodeURIComponent(url)}&size=600`} download="menu-qr.png" className="flex-1">
            <Button block>Imprimer le QR</Button>
          </a>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold">Votre menu</h2>
        {products.length === 0 ? (
          <EmptyState
            title="Votre menu est vide."
            description="Ajoutez des produits pour les afficher ici."
            action={<LinkButton href="/app/products">Ajouter un produit</LinkButton>}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded border border-line bg-surface px-4 py-3"
              >
                <span className="text-[0.9375rem]">{p.name}</span>
                {p.price != null && <span className="font-medium text-ink-soft">{formatPrice(p.price)}</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
