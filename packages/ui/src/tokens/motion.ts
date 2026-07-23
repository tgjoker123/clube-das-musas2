/**
 * Tokens de movimento — espelham docs/07_DESIGN_SYSTEM.md, seção 8.
 * Nunca usar animação decorativa sem propósito funcional.
 */
export const duration = {
  micro: "180ms", // hover, toggle
  transition: "350ms", // troca de tela, modal
  celebration: "600ms", // celebrações de gamificação (ver docs/12_ARQUITETURA_DE_EXPERIENCIA.md)
} as const;

export const easing = {
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;
