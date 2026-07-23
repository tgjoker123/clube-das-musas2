import * as React from "react";
import { cn } from "../utils/cn.ts";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

/** Campo de texto base — docs/07_DESIGN_SYSTEM.md §7 ("Input / Form Field"). */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid}
        className={cn(
          "bg-bg-elevated text-body text-fg-primary h-11 w-full rounded-sm border px-4",
          "placeholder:text-fg-secondary",
          "focus-visible:outline-accent-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          invalid ? "border-error" : "border-border",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

/** Rótulo de campo — sempre visível acima do input (nunca apenas placeholder). */
export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-small text-fg-primary font-medium", className)} {...props} />;
}

/** Mensagem de erro de validação, exibida abaixo do campo. */
export function FieldError({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p role="alert" className={cn("text-small text-error", className)} {...props} />;
}
