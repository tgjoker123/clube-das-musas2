import * as React from "react";
import { cn } from "../utils/cn.ts";

/** Card base — docs/07_DESIGN_SYSTEM.md §7. Padding 16–24px, borda de 1px. */
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-border bg-bg-elevated rounded-md border p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-h3 text-fg-primary font-sans font-semibold", className)} {...props} />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-small text-fg-secondary", className)} {...props} />;
}
