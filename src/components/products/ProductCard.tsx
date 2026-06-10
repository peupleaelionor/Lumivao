"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product, onRemove }: { product: Product; onRemove?: () => void }) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 flex-none items-center justify-center rounded bg-cream text-lg">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.imageUrl} alt="" className="h-full w-full rounded object-cover" />
        ) : (
          "🛍️"
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{product.name}</p>
        <div className="flex items-center gap-2 text-sm text-ink-soft">
          {product.price != null && <span>{formatPrice(product.price)}</span>}
          {product.category && <Badge tone="neutral">{product.category}</Badge>}
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex-none text-sm text-ink-soft hover:text-danger"
          aria-label="Supprimer"
        >
          Supprimer
        </button>
      )}
    </Card>
  );
}
