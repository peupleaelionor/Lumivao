import { cn } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";

export interface Plan {
  name: string;
  price: string;
  period?: string;
  tagline: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border p-6",
        plan.featured ? "border-ink bg-ink text-cream" : "border-line bg-surface",
      )}
    >
      {plan.featured && (
        <span className="mb-1 inline-flex w-fit rounded-full bg-green px-2.5 py-1 text-xs font-semibold text-ink">
          Recommandé
        </span>
      )}
      <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
      <p className="mt-3 font-display text-[2.25rem] font-semibold leading-none tracking-tight">
        {plan.price}
        {plan.period && (
          <span className={cn("ml-1 text-[0.9375rem] font-medium", plan.featured ? "text-cream/70" : "text-ink-soft")}>
            {plan.period}
          </span>
        )}
      </p>
      <p className={cn("mt-2 text-[0.9375rem]", plan.featured ? "text-cream/70" : "text-ink-soft")}>
        {plan.tagline}
      </p>
      <ul className="my-6 grid gap-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[0.9375rem]">
            <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-none text-green" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z"
                clipRule="evenodd"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <LinkButton
        href="/app/onboarding"
        variant={plan.featured ? "accent" : "secondary"}
        className="mt-auto"
        block
      >
        {plan.cta}
      </LinkButton>
    </div>
  );
}
