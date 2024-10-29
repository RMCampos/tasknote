import react from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import {fileURLToPath} from "node:url";
import js from "@eslint/js";
import {FlatCompat} from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/__test__/*",
      "**/assets/*",
      "**/*.scss",
      "**/*.css",
      "**/*.svg",
    ],
  },
  ...compat.extends(
    "plugin:react/recommended",
    "plugin:jsdoc/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ),
  {
    plugins: {
      react,
      "@typescript-eslint": typescriptEslint,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        JSX: true,
        RequestInit: true,
        BodyInit: true,
        NodeJS: true,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
      react: {
        pragma: "React",
        fragment: "Fragment",
        version: "18.3",
      },
    },

    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
];
