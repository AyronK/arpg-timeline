import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import react from "eslint-plugin-react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            react,
            "@typescript-eslint": tseslint.plugin,
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error"],
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
        },
        settings: {
            react: { version: "detect" },
        },
    },
];

export default eslintConfig;
