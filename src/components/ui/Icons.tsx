import { cn } from "@/lib/utils";

// ── Jeu d'icônes minimal (ligne, 1.8px) ──────────────────────────────
// Utilisé avec parcimonie, toujours dans une pastille verte douce.

type IconProps = { className?: string };

const base = "h-[22px] w-[22px]";
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function FlyerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

export function StoryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke} strokeDasharray="3 3">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export function PosterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

export function QrIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <path d="M14 14h3v3M20 14v6M17 20h3" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M5 19l1.2-3.2A7 7 0 1 1 9 18.5L5 19z" />
      <path d="M9.2 9.3c-.2 1.6 2 3.8 3.6 3.6.5-.1.9-.5 1.1-1l-1.3-.8-.7.6c-.5-.2-1.1-.8-1.3-1.3l.6-.7-.8-1.3c-.5.2-.9.6-1 1.1z" />
    </svg>
  );
}

export function StoreIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M4 9l1-4h14l1 4M5 9v10h14V9M5 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
    </svg>
  );
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" stroke="none">
      <path d="M12 3.5l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TicketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4z" />
      <path d="M12 9.2l.6 1.3 1.4.2-1 1 .3 1.4-1.3-.7-1.3.7.3-1.4-1-1 1.4-.2z" />
    </svg>
  );
}

export function A4Icon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <text x="12" y="17" textAnchor="middle" fontSize="6" fontWeight="700" fill="currentColor" stroke="none">
        A4
      </text>
    </svg>
  );
}

export function TagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9z" />
      <circle cx="7.5" cy="7.5" r="1.4" />
    </svg>
  );
}

export function BulbIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.6.6-1 1.3-1 2.1H9c0-.8-.4-1.5-1-2.1A6 6 0 0 1 12 3z" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M4 19V5M4 19h16M8 16v-3M12 16v-6M16 16v-4M20 7l-4 3-4-3-4 2" />
    </svg>
  );
}

export function StackIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M9 4l3 1.7L9 7.4 6 5.7zM15 4l3 1.7-3 1.7-3-1.7zM12 9l3 1.7-3 1.7-3-1.7zM6 12l3 1.7L6 15.4 3 13.7zM18 12l3 1.7-3 1.7-3-1.7z" />
    </svg>
  );
}

export function PersonIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M4 5h16v11H9l-4 3z" />
      <path d="M11.5 9l.5 1 1 .2-.8.7.2 1-1-.5-1 .5.2-1-.8-.7 1-.2z" />
    </svg>
  );
}

export function TvIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 6V3" />
    </svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

export function EuroIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M16 7a6 6 0 1 0 0 10M5 10h7M5 14h7" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" stroke="none">
      <path d="M13 2L4 14h6l-1 8 9-12h-6z" />
    </svg>
  );
}

export function CrownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} {...stroke}>
      <path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.5 10h-13z" />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn(base, className)} fill="currentColor" stroke="none">
      <path d="M12 2l1.8 4.5L18 8l-4.2 1.5L12 14l-1.8-4.5L6 8l4.2-1.5z" />
      <path d="M18 14l.9 2.2L21 17l-2.1.8L18 20l-.9-2.2L15 17l2.1-.8z" />
    </svg>
  );
}

/** Pastille colorée autour d'une icône (style maquettes). */
export function IconBubble({
  children,
  tone = "green",
  className,
}: {
  children: React.ReactNode;
  tone?: "green" | "orange" | "instagram" | "neutral";
  className?: string;
}) {
  const tones = {
    green: "bg-green-tint text-green-dense",
    orange: "bg-orange-tint text-orange-dense",
    instagram: "bg-[#FCE9F1] text-[#C13584]",
    neutral: "bg-[#EFE9DF] text-ink-soft",
  } as const;
  return (
    <span
      className={cn(
        "flex h-11 w-11 flex-none items-center justify-center rounded-full",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
