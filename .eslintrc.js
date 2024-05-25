module.exports = {
  root: true,
  extends: ["@react-native", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    semi: ["error", "never"],
    "no-extra-semi": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { vars: "all", args: "none", ignoreRestSiblings: true },
    ],
    "react-hooks/exhaustive-deps": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-shadow": ["error"],
        "no-shadow": "off",
        "no-undef": "off",
        "@typescript-eslint/semi": ["error", "never"],
        "@typescript-eslint/no-unused-vars": [
          "warn",
          { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
        ],
        "react-hooks/exhaustive-deps": "off",
      },
    },
  ],
}
