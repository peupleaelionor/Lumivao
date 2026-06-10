import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[0.8125rem] font-medium text-ink-soft">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "h-[52px] w-full rounded bg-surface border border-line px-4 text-ink",
          "placeholder:text-ink-soft/70 outline-none transition",
          "focus:border-ink focus:ring-2 focus:ring-green/20",
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Input.displayName = "Input";
