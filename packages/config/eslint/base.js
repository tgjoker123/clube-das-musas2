// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Base ESLint (flat config) shared by every app and package do monorepo.
 * Regras específicas de framework (Next.js, NestJS) estendem esta base
 * em vez de duplicá-la.
 */
export const baseConfig = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    ignores: ["dist/**", ".next/**", "build/**", "node_modules/**", "coverage/**"],
  },
);

export default baseConfig;
