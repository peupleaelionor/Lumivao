"use client";

import { useSyncExternalStore } from "react";
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

// Références serveur stables (pas de nouvelle allocation par rendu).
const EMPTY_ARRAY: never[] = [];
const serverNull = () => null;
const serverEmpty = () => EMPTY_ARRAY;

export function useBusiness(): Business | null {
  return useSyncExternalStore(subscribe, getBusiness, serverNull);
}

export function useProducts(): Product[] {
  return useSyncExternalStore(subscribe, getProducts, serverEmpty);
}

export function useOffers(): Offer[] {
  return useSyncExternalStore(subscribe, getOffers, serverEmpty);
}

export function useCustomers(): Customer[] {
  return useSyncExternalStore(subscribe, getCustomers, serverEmpty);
}
