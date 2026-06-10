import { cn } from "@/lib/utils";

type Tone = "neutral" | "published" | "draft" | "promo" | "new";

const tones: Record<Tone, string> = {
  neutral: "bg-[#EFE9DF] text-ink-soft",
  published: "bg-green-tint text-green-dense",
  draft: "bg-[#EFE9DF] text-ink-soft",
  promo: "bg-orange-tint text-orange-dense",
  new: "bg-green-tint text-green-dense",
};

interface BadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
