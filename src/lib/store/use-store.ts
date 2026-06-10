"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  getBusiness,
  getCustomers,
  getOffers,
  getProducts,
} from "./local-store";
import type { Business, Customer, Offer, Product } from "@/types";

// Abonnement aux changements du magasin local (événement custom + storage).
function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("lumivao:change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("lumivao:change", callback);
    window.removeEventListener("storage", callback);
  };
}

function useStore<T>(getSnapshot: () => T, serverSnapshot: T): T {
  return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

export function useBusiness(): Business | null {
  return useStore<Business | null>(getBusiness, null);
}

export function useProducts(): Product[] {
  return useStore<Product[]>(getProducts, []);
}

export function useOffers(): Offer[] {
  return useStore<Offer[]>(getOffers, []);
}

export function useCustomers(): Customer[] {
  return useStore<Customer[]>(getCustomers, []);
}

/** Force un re-render quand le magasin change (utilitaire). */
export function useStoreSync(): void {
  const noop = useCallback(() => {}, []);
  useEffect(() => subscribe(noop), [noop]);
}
