module.exports = {
  root: true,

  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended",
      ],
      env: {
        es6: true,
      },
      rules: {
        "react/prop-types": "off",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "no-relative-import-paths/no-relative-import-paths": [
          "warn",
          { allowSameFolder: false, rootDir: "src", prefix: "@" },
        ],
      },
      plugins: ["react", "no-relative-import-paths"],
    },
    {
      files: ["*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      plugins: ["@graphql-eslint"],
      rules: {
        "@graphql-eslint/no-anonymous-operations": "error",
        "@graphql-eslint/naming-convention": [
          "error",
          {
            OperationDefinition: {
              style: "PascalCase",
              forbiddenPrefixes: ["Query", "Mutation", "Subscription", "Get"],
              forbiddenSuffixes: ["Query", "Mutation", "Subscription"],
            },
          },
        ],
      },
    },
  ],
  extends: ["plugin:storybook/recommended"],
  settings: {
    react: { version: "detect" },
    propWrapperFunctions: ["forbidExtraProps"],
  },
};
