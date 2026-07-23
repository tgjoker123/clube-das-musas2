/**
 * Escala de espaçamento — espelha docs/07_DESIGN_SYSTEM.md, seção 4.
 * Base de 8px. Qualquer margem/padding/gap deve usar um destes valores.
 *
 * Esta escala corresponde EXATAMENTE à escala numérica padrão do Tailwind
 * (múltiplos de 4px) — em componentes, use as utilities nativas (`p-4`,
 * `gap-6`...), não tokens nomeados próprios (ver
 * packages/ui/src/styles/tokens.css para o motivo). Este objeto existe
 * para referência/documentação e para consumidores não-Tailwind.
 */
export const spacing = {
  "3xs": { px: "4px", tailwind: "1" },
  "2xs": { px: "8px", tailwind: "2" },
  xs: { px: "12px", tailwind: "3" },
  sm: { px: "16px", tailwind: "4" },
  md: { px: "24px", tailwind: "6" },
  lg: { px: "32px", tailwind: "8" },
  xl: { px: "48px", tailwind: "12" },
  "2xl": { px: "64px", tailwind: "16" },
} as const;

export const grid = {
  desktop: { columns: 12, margin: "32px", gutter: "24px" },
  mobile: { columns: 4, margin: "16px", gutter: "16px" },
} as const;

export const breakpoints = {
  mobile: "0px",
  tablet: "641px",
  desktop: "1025px",
} as const;
