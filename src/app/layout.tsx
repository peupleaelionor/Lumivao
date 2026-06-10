import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "LUMIVAO — Vendez plus chaque jour, même sans site",
    template: "%s · LUMIVAO",
  },
  description:
    "LUMIVAO transforme une simple offre en flyer, QR code, message WhatsApp, menu et mini-vitrine en moins d'une minute.",
  applicationName: "LUMIVAO",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/app-icon.svg" },
  openGraph: {
    title: "LUMIVAO — Vendez plus chaque jour, même sans site",
    description:
      "Une offre. Tous vos supports prêts à partager. Sans site, sans graphiste, sans complexité.",
    type: "website",
    locale: "fr_FR",
    siteName: "LUMIVAO",
    images: [{ url: "/app-icon.svg", width: 512, height: 512, alt: "LUMIVAO" }],
  },
  twitter: {
    card: "summary",
    title: "LUMIVAO — Vendez plus chaque jour, même sans site",
    description:
      "Une offre. Tous vos supports prêts à partager. Sans site, sans graphiste, sans complexité.",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
