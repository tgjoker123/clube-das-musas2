"use client";

import { useTheme } from "./theme-provider.tsx";
import { cn } from "../utils/cn.ts";

/** Alterna entre os temas Luxo/Elegance — docs/07_DESIGN_SYSTEM.md §7. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Trocar para o tema ${theme === "luxo" ? "Elegance" : "Luxo"}`}
      className={cn(
        "rounded-pill border-border text-caption text-fg-secondary hover:text-accent-gold inline-flex h-9 items-center gap-2 border px-4 font-medium transition-colors",
        className,
      )}
    >
      <span aria-hidden className="rounded-pill bg-accent-gold h-2 w-2" />
      {theme === "luxo" ? "Luxo" : "Elegance"}
    </button>
  );
}
