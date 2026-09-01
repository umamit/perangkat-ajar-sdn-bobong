import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-apple-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-primary via-primary to-primary-dark text-white font-bold shadow-md shadow-primary/20 border border-white/30 hover:brightness-105 hover:shadow-lg hover:shadow-primary/30",
        secondary:
          "bg-white/70 backdrop-blur-md text-slate-700 font-bold hover:bg-white/90 border border-white/80 shadow-xs hover:border-slate-200",
        outline:
          "border border-slate-200/80 bg-white/60 backdrop-blur-md text-slate-700 font-bold hover:bg-white/90 hover:border-primary/50 hover:text-primary-dark shadow-xs",
        destructive:
          "bg-gradient-to-b from-rose-500 to-rose-600 text-white font-bold shadow-md shadow-rose-500/20 border border-white/20 hover:brightness-105 hover:shadow-lg hover:shadow-rose-500/30",
        accent:
          "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20 border border-white/20 hover:brightness-105 hover:shadow-lg hover:shadow-emerald-500/30",
        gold:
          "bg-gradient-to-b from-amber-400 to-secondary text-slate-950 font-black shadow-md shadow-amber-500/20 border border-white/40 hover:brightness-105 hover:shadow-lg hover:shadow-amber-500/30",
        ghost:
          "hover:bg-white/50 backdrop-blur-sm text-slate-600 hover:text-slate-900 rounded-apple-md",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm rounded-apple-md",
        sm: "h-8.5 rounded-apple-sm px-3 text-xs",
        lg: "h-12 rounded-apple-lg px-6 text-base font-bold",
        icon: "h-9 w-9 p-0 rounded-apple-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
