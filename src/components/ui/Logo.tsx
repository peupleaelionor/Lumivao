import { cn } from "@/lib/utils";

/** Marque LUMIVAO : soleil/éclat orange (rayons radiants). */
export function LogoMark({ className }: { className?: string }) {
  const rays = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg viewBox="0 0 40 40" className={cn("h-8 w-8", className)} aria-hidden>
      <g stroke="#F28C28" strokeWidth="2.4" strokeLinecap="round">
        {rays.map((deg) => {
          const r = (deg * Math.PI) / 180;
          const inner = 9.5;
          const outer = deg % 60 === 0 ? 17 : 14.5;
          return (
            <line
              key={deg}
              x1={20 + inner * Math.cos(r)}
              y1={20 + inner * Math.sin(r)}
              x2={20 + outer * Math.cos(r)}
              y2={20 + outer * Math.sin(r)}
            />
          );
        })}
      </g>
      <circle cx="20" cy="20" r="6.5" fill="#F28C28" />
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
