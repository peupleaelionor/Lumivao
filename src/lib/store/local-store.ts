"use client";

import type { Business, Customer, Offer, Product } from "@/types";
import { nowIso, uid } from "@/lib/utils";

// ── Magasin local (mode démo) ────────────────────────────────────────
// Persiste l'état dans localStorage pour rendre le MVP immédiatement
// testable sans base de données. En production, brancher Supabase
// (schéma fourni dans prisma/schema.prisma et supabase/schema.sql).

const KEYS = {
  business: "lumivao.business",
  products: "lumivao.products",
  offers: "lumivao.offers",
  customers: "lumivao.customers",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("lumivao:change"));
}

// ── Business ─────────────────────────────────────────────────────────
export function getBusiness(): Business | null {
  return read<Business | null>(KEYS.business, null);
}

export function saveBusiness(
  data: Omit<Business, "id" | "createdAt" | "updatedAt"> & Partial<Pick<Business, "id">>,
): Business {
  const existing = getBusiness();
  const business: Business = {
    ...data,
    id: data.id ?? existing?.id ?? uid("biz"),
    createdAt: existing?.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
  write(KEYS.business, business);
  return business;
}

// ── Products ─────────────────────────────────────────────────────────
export function getProducts(): Product[] {
  return read<Product[]>(KEYS.products, []);
}

export function addProduct(
  input: Pick<Product, "businessId" | "name"> & Partial<Product>,
): Product {
  const products = getProducts();
  const product: Product = {
    id: uid("prod"),
    businessId: input.businessId,
    name: input.name,
    description: input.description ?? null,
    category: input.category ?? null,
    price: input.price ?? null,
    oldPrice: input.oldPrice ?? null,
    imageUrl: input.imageUrl ?? null,
    active: input.active ?? true,
    stockQuantity: input.stockQuantity ?? null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  write(KEYS.products, [product, ...products]);
  return product;
}

export function removeProduct(id: string): void {
  write(
    KEYS.products,
    getProducts().filter((p) => p.id !== id),
  );
}

// ── Offers ───────────────────────────────────────────────────────────
export function getOffers(): Offer[] {
  return read<Offer[]>(KEYS.offers, []);
}

export function saveOffer(
  input: Omit<Offer, "id" | "createdAt" | "updatedAt"> & Partial<Pick<Offer, "id">>,
): Offer {
  const offers = getOffers();
  const offer: Offer = {
    ...input,
    id: input.id ?? uid("offer"),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  write(KEYS.offers, [offer, ...offers.filter((o) => o.id !== offer.id)]);
  return offer;
}

export function getLatestPublishedOffer(): Offer | null {
  return getOffers().find((o) => o.status === "published") ?? null;
}

// ── Customers ────────────────────────────────────────────────────────
export function getCustomers(): Customer[] {
  return read<Customer[]>(KEYS.customers, []);
}

export function addCustomer(
  input: Pick<Customer, "businessId" | "name"> & Partial<Customer>,
): Customer {
  const customers = getCustomers();
  const customer: Customer = {
    id: uid("cust"),
    businessId: input.businessId,
    name: input.name,
    phone: input.phone ?? null,
    points: input.points ?? 0,
    lastVisitAt: input.lastVisitAt ?? null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  write(KEYS.customers, [customer, ...customers]);
  return customer;
}

export function addPoint(id: string): void {
  write(
    KEYS.customers,
    getCustomers().map((c) =>
      c.id === id
        ? { ...c, points: c.points + 1, lastVisitAt: nowIso(), updatedAt: nowIso() }
        : c,
    ),
  );
}
