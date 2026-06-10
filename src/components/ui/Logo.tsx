import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("h-7 w-7", className)} aria-hidden>
      <rect x="6" y="6" width="52" height="52" rx="14" fill="#121212" />
      <path
        d="M23 18V40H38"
        stroke="#F7F3EC"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="38" y="38" width="9" height="9" rx="2.5" fill="#18C26E" />
    </svg>
  );
}

export function Logo({ className, mono }: { className?: string; mono?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span
        className={cn(
          "font-display font-semibold text-xl tracking-[0.06em]",
          mono ? "text-cream" : "text-ink",
        )}
      >
        LUMIVAO
      </span>
    </span>
  );
}
