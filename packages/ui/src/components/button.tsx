import * as React from "react";
import { cn } from "../utils/cn.ts";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent-gold text-bg-base hover:bg-accent-gold-muted",
  secondary: "border border-accent-gold bg-transparent text-accent-gold hover:bg-accent-gold/10",
  ghost: "bg-transparent text-fg-primary hover:bg-bg-elevated",
  destructive: "bg-error text-fg-primary hover:opacity-90",
};

/**
 * Botão base — variantes conforme docs/07_DESIGN_SYSTEM.md §7.
 * Altura mínima de toque de 44px (acessibilidade, §9).
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "text-body inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-6 font-sans font-medium",
          "transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline-accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          variantClasses[variant],
          className,
        )}
        style={{
          transitionDuration: "var(--duration-micro)",
          transitionTimingFunction: "var(--ease-enter)",
        }}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden
            className="rounded-pill h-4 w-4 animate-spin border-2 border-current border-t-transparent"
          />
        ) : (
          children
        )}
      </button>
    );
  },
);
Button.displayName = "Button";
