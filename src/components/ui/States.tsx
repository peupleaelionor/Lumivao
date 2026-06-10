import { cn } from "@/lib/utils";

// ── États : vide / chargement / succès ───────────────────────────────

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface/60 p-8 text-center">
      <p className="font-display font-semibold text-ink">{title}</p>
      <p className="mt-1.5 text-[0.9375rem] text-ink-soft">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Préparation de vos supports…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-green animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="text-[0.9375rem] text-ink-soft">{label}</p>
    </div>
  );
}

export function SuccessMessage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded bg-green-tint px-4 py-3 text-[0.9375rem] font-medium text-green-dense",
        className,
      )}
    >
      <svg viewBox="0 0 20 20" className="h-5 w-5 flex-none" fill="currentColor" aria-hidden>
        <path
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z"
          clipRule="evenodd"
        />
      </svg>
      {children}
    </div>
  );
}

/** Squelette doux pour le chargement de cartes. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-line/60", className)} />;
}
