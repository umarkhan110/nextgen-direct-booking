import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // Change to warning instead of error
      "@typescript-eslint/no-explicit-any": "off", // Disable 'any' type errors
      "prefer-const": "warn", // Make unused variables warnings
      "@typescript-eslint/no-empty-function": "off", // Allow empty functions
      "@typescript-eslint/ban-ts-comment": "off", // Allow @ts-ignore comments
    },
  },
];

export default eslintConfig;
