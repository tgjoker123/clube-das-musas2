import { luxoTheme } from "./luxo.ts";
import { eleganceTheme } from "./elegance.ts";
import type { ThemeName } from "../tokens/colors.ts";

export { luxoTheme } from "./luxo.ts";
export { eleganceTheme } from "./elegance.ts";

export const themes = {
  luxo: luxoTheme,
  elegance: eleganceTheme,
} as const satisfies Record<ThemeName, unknown>;

export const DEFAULT_THEME: ThemeName = "luxo";
