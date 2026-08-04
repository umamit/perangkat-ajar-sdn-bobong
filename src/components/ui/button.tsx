import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-apple-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-white shadow-sm hover:bg-primary-dark hover:shadow-md",
        secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80",
        outline: "border border-primary text-primary-dark hover:bg-primary/10",
        destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
        accent: "bg-accent text-white shadow-sm hover:bg-emerald-700",
        gold: "bg-secondary text-slate-900 font-bold shadow-sm hover:bg-amber-500",
        ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 rounded-apple-sm px-3 text-xs",
        lg: "h-12 rounded-apple-lg px-6 text-base",
        icon: "h-9 w-9 p-0",
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
