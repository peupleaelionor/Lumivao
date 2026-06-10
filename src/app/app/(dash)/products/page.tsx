"use client";

import { useState } from "react";
import { useBusiness, useProducts } from "@/lib/store/use-store";
import { addProduct, removeProduct } from "@/lib/store/local-store";
import { getBusinessType } from "@/data/business-types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/ui/States";

export default function ProductsPage() {
  const business = useBusiness();
  const products = useProducts();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  if (!business) return null;
  const typeDef = getBusinessType(business.type);

  function add() {
    if (!business || !name.trim()) return;
    const priceNum = price ? Number.parseFloat(price.replace(",", ".")) : null;
    addProduct({
      businessId: business.id,
      name: name.trim(),
      price: Number.isNaN(priceNum as number) ? null : priceNum,
      category: category.trim() || null,
    });
    setName("");
    setPrice("");
    setCategory("");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold">Produits & services</h1>
        <p className="mt-1 text-[0.9375rem] text-ink-soft">
          Vos {typeDef.productLabel}s apparaissent dans votre mini-vitrine et vos menus.
        </p>
      </header>

      <Card className="bg-surface">
        <div className="flex flex-col gap-3">
          <Input
            label={`Nom du ${typeDef.productLabel}`}
            placeholder={typeDef.examples[0]}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prix (€)" inputMode="decimal" placeholder="9,90" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Input label="Catégorie" placeholder="Menu du jour" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <Button onClick={add} disabled={!name.trim()}>
            Ajouter
          </Button>
        </div>
      </Card>

      {products.length === 0 ? (
        <EmptyState
          title="Aucun produit pour le moment."
          description="Ajoutez un produit ou un service pour remplir votre vitrine."
        />
      ) : (
        <div className="flex flex-col gap-2.5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onRemove={() => removeProduct(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
