// ── Petits utilitaires partagés ──────────────────────────────────────

/** Concatène des classes conditionnelles (mini clsx). */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Identifiant court et lisible. */
export function uid(prefix = ""): string {
  const s = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
  return prefix ? `${prefix}_${s}` : s;
}

/** Transforme un nom en slug d'URL : « Chez Awa » → « chez-awa ». */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

/** Formate un prix en euros : 9.9 → « 9,90 € ». */
export function formatPrice(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "";
  return `${value.toFixed(2).replace(".", ",")} €`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
