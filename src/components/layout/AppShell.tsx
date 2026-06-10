import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { MobileNav } from "./MobileNav";

const DESKTOP_LINKS = [
  { href: "/app", label: "Accueil" },
  { href: "/app/today", label: "Offre du jour" },
  { href: "/app/products", label: "Produits" },
  { href: "/app/menu", label: "Menu QR" },
  { href: "/app/flyers", label: "Offres" },
  { href: "/app/customers", label: "Clients" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream pb-20 md:pb-0">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4">
          <Link href="/app" aria-label="Accueil LUMIVAO">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {DESKTOP_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-[0.9375rem] text-ink-soft hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-content px-4 py-6">{children}</main>
      <MobileNav />
    </div>
  );
}
