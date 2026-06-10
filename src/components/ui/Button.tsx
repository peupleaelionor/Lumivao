import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent" | "ghost";
type Size = "md" | "sm" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium leading-none rounded transition active:translate-y-px disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-cream hover:bg-black shadow-soft",
  secondary: "bg-surface text-ink border border-line hover:border-ink",
  accent: "bg-green text-ink font-semibold hover:bg-green-dense hover:text-cream",
  ghost: "bg-transparent text-ink hover:text-green-dense",
};

const sizes: Record<Size, string> = {
  sm: "h-11 px-4 text-[0.9375rem]",
  md: "h-[52px] px-6 text-base",
  lg: "h-[56px] px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
}

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", block, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], block && "w-full", className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

type LinkButtonProps = CommonProps &
  React.ComponentProps<typeof Link>;

export function LinkButton({
  variant = "primary",
  size = "md",
  block,
  className,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], block && "w-full", className)}
      {...props}
    />
  );
}
