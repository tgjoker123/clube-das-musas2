import { baseConfig } from "@musas/config/eslint/base";

export default [
  ...baseConfig,
  {
    ignores: ["src/generated/**"],
  },
];
