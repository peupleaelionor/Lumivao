import { cn } from "@/lib/utils";

interface QRBlockProps {
  /** Contenu encodé dans le QR (URL, lien WhatsApp, etc.). */
  data: string;
  label?: string;
  size?: number;
  className?: string;
}

/**
 * Bloc QR autonome. L'image est servie par /api/qr (génération serveur),
 * donc aucun JS client n'est requis pour l'afficher.
 */
export function QRBlock({ data, label = "Scanner pour commander", size = 220, className }: QRBlockProps) {
  const src = `/api/qr?data=${encodeURIComponent(data)}&size=${size}`;
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center gap-2 rounded-lg border border-line bg-white p-3",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="QR code" width={size} height={size} className="h-auto w-full max-w-[220px]" />
      {label && <span className="text-xs font-medium text-ink-soft">{label}</span>}
    </div>
  );
}
