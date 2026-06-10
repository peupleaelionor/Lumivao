import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  title: "LUMIVAO — Vendez plus chaque jour, même sans site.",
  description:
    "LUMIVAO transforme une simple offre en flyer, QR code, message WhatsApp, menu et mini-vitrine en moins d'une minute.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/app-icon.svg" },
  openGraph: {
    title: "LUMIVAO — Vendez plus chaque jour, même sans site.",
    description:
      "Une offre. Tous vos supports prêts à partager. Sans site, sans graphiste, sans complexité.",
    type: "website",
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
