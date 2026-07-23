import { luxoColors, semanticColors } from "../tokens/colors.ts";

export const luxoTheme = {
  name: "luxo" as const,
  label: "Luxo",
  colors: { ...luxoColors, ...semanticColors.luxo },
};
