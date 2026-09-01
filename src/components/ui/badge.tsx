import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-apple-sm border px-2.5 py-0.5 text-xs font-extrabold transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-2xs backdrop-blur-xs",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-cyan-50/80 text-primary-dark hover:bg-cyan-100/80",
        secondary: "border-slate-200/80 bg-white/70 text-slate-700 hover:bg-white/90",
        success: "border-emerald-200/80 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/80",
        warning: "border-amber-200/80 bg-amber-50/80 text-amber-700 hover:bg-amber-100/80",
        danger: "border-rose-200/80 bg-rose-50/80 text-rose-700 hover:bg-rose-100/80",
        outline: "border-slate-200/80 bg-white/60 text-slate-700 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
