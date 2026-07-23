/**
 * Escala de border-radius — espelha docs/07_DESIGN_SYSTEM.md, seção 5.
 * Nunca usar `0` (quebra a suavidade exigida pela identidade visual) nem
 * pílula fora de badges/tags.
 */
export const radius = {
  sm: "8px",
  md: "12px",
  lg: "20px",
  pill: "9999px",
} as const;
