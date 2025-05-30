import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off", // Disable this rule
    },
  },
];
