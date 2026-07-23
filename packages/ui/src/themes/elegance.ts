import { eleganceColors, semanticColors } from "../tokens/colors.ts";

export const eleganceTheme = {
  name: "elegance" as const,
  label: "Elegance",
  colors: { ...eleganceColors, ...semanticColors.elegance },
};
