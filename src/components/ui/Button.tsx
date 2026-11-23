import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-[transform,background-color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ll-ring)] disabled:pointer-events-none disabled:opacity-55 motion-safe:hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-[0_10px_28px_rgba(232,93,50,.22)] hover:bg-[#d94f28]",
        dark: "bg-foreground text-white hover:bg-brand-deep",
        outline: "border border-border bg-transparent text-foreground hover:border-foreground hover:bg-surface",
        quiet: "bg-transparent text-foreground hover:bg-black/5",
        light: "border border-white/35 bg-white/10 text-white backdrop-blur hover:bg-white/20",
      },
      size: {
        default: "min-h-12 px-6",
        small: "min-h-10 px-4 text-xs",
        icon: "size-11 min-h-11 p-0",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "dark", size: "default" },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, block }), className)} {...props} />
  ),
);

Button.displayName = "Button";
