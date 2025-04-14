module.exports = {
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      env: {
        es6: true,
      },
      rules: {
        "no-relative-import-paths/no-relative-import-paths": "off",
      },
    },
  ],
};
