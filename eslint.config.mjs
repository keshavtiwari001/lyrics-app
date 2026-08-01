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
    rules: {
      // Enforce consistent imports
      "import/order": "off",
      // No unused variables — keeps code clean
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Disallow 'any' type — enforces proper TypeScript usage
      "@typescript-eslint/no-explicit-any": "error",
      // Prefer const over let where possible
      "prefer-const": "error",
    },
  },
];

export default eslintConfig;
