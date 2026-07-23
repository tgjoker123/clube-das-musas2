/**
 * Tokens de cor — espelham docs/07_DESIGN_SYSTEM.md, seção 2.
 *
 * Os dois temas usam tons de dourado DIFERENTES de propósito: o dourado
 * calibrado para contraste sobre preto (#D4AF37) não atinge 4.5:1 (WCAG AA)
 * sobre fundo branco, por isso o tema Elegance usa uma variante mais escura.
 * Nunca "unificar" os dois valores — isso reintroduziria a falha de contraste.
 */

export const luxoColors = {
  backgroundBase: "#0D0D0F",
  backgroundElevated: "#18181B",
  backgroundSunken: "#000000",
  foregroundPrimary: "#F5F1E8",
  foregroundSecondary: "#A8A29A",
  accentGold: "#D4AF37",
  accentGoldMuted: "#8C7530",
  border: "#2A2A2E",
} as const;

export const eleganceColors = {
  backgroundBase: "#FAFAF7",
  backgroundElevated: "#FFFFFF",
  backgroundSunken: "#F0EFE9",
  foregroundPrimary: "#1A1A1C",
  foregroundSecondary: "#5C5A54",
  accentGold: "#A9791F",
  accentGoldMuted: "#C9A227",
  border: "#E4E2DA",
} as const;

/** Cores semânticas — deliberadamente dessaturadas (ver 07_DESIGN_SYSTEM.md §2.3). */
export const semanticColors = {
  luxo: {
    success: "#4F7A5C",
    warning: "#B8894A",
    error: "#A34C4C",
    info: "#5B7A96",
  },
  elegance: {
    success: "#3D6047",
    warning: "#96692F",
    error: "#8A3A3A",
    info: "#3F5F7A",
  },
} as const;

export type ThemeName = "luxo" | "elegance";
export type ColorTokens = typeof luxoColors & (typeof semanticColors)["luxo"];
