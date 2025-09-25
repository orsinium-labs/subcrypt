import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  globalIgnores(["dist/*", "coverage/*"]),
  tseslint.configs.recommended,
  { rules: { "@typescript-eslint/no-namespace": "off" } },
]);
