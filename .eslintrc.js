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
      rules: {
        // Group the imports in a more structured way:
        "import/order": [
          "warn",
          {
            alphabetize: { order: "asc" },
            groups: [
              "builtin",
              "external",
              "internal",
              ["parent", "sibling", "index"],
            ],
            "newlines-between": "always",
          },
        ],

        // Order everything that can be ordered in a definite way:
        "sort-keys": "warn",
      },
    },
  ],
  root: true,
};
