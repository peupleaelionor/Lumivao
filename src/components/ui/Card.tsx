import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ interactive, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-line rounded-lg p-6",
        interactive &&
          "transition hover:-translate-y-0.5 hover:shadow-soft hover:border-[#D8CEBF] cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}
