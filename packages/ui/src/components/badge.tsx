import * as React from "react";
import { cn } from "../utils/cn.ts";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/15 text-error",
  info: "bg-info/15 text-info",
  neutral: "bg-fg-secondary/15 text-fg-secondary",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/** Status pill — docs/07_DESIGN_SYSTEM.md §7 ("Badge / Status Pill"). */
export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-pill text-caption inline-flex items-center px-3 py-[2px] font-medium",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
