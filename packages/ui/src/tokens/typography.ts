/**
 * Tokens de tipografia — espelham docs/07_DESIGN_SYSTEM.md, seção 3.
 *
 * A fonte serifada (`display`) é reservada a momentos de impacto emocional
 * (ver docs/12_ARQUITETURA_DE_EXPERIENCIA.md) e nunca usada em texto denso
 * de interface — apenas `sans` é usada em formulários, tabelas e listas.
 */

export const fontFamilies = {
  display: "'Playfair Display', Georgia, serif",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

export interface TypeStyle {
  fontFamily: keyof typeof fontFamilies;
  fontWeight: number;
  lineHeight: number;
  fontSizeMobile: string;
  fontSizeDesktop: string;
}

export const typeScale: Record<
  "display" | "h1" | "h2" | "h3" | "body" | "small" | "caption",
  TypeStyle
> = {
  display: {
    fontFamily: "display",
    fontWeight: 600,
    lineHeight: 1.2,
    fontSizeMobile: "40px",
    fontSizeDesktop: "48px",
  },
  h1: {
    fontFamily: "sans",
    fontWeight: 600,
    lineHeight: 1.2,
    fontSizeMobile: "28px",
    fontSizeDesktop: "32px",
  },
  h2: {
    fontFamily: "sans",
    fontWeight: 600,
    lineHeight: 1.2,
    fontSizeMobile: "22px",
    fontSizeDesktop: "24px",
  },
  h3: {
    fontFamily: "sans",
    fontWeight: 600,
    lineHeight: 1.3,
    fontSizeMobile: "18px",
    fontSizeDesktop: "18px",
  },
  body: {
    fontFamily: "sans",
    fontWeight: 400,
    lineHeight: 1.5,
    fontSizeMobile: "15px",
    fontSizeDesktop: "16px",
  },
  small: {
    fontFamily: "sans",
    fontWeight: 400,
    lineHeight: 1.5,
    fontSizeMobile: "13px",
    fontSizeDesktop: "13px",
  },
  caption: {
    fontFamily: "sans",
    fontWeight: 500,
    lineHeight: 1.4,
    fontSizeMobile: "11px",
    fontSizeDesktop: "11px",
  },
};
