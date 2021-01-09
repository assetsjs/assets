module.exports = {
  overrides: [
    {
      extends: ["airbnb-base", "prettier"],
      files: ["*.js"],
    },
    {
      extends: [
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
        "prettier/@typescript-eslint",
      ],
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
      plugins: ["@typescript-eslint"],
    },
  ],
  root: true,
};
