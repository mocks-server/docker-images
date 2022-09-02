module.exports = {
  env: {
    node: true,
    es6: true,
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    sourceType: "module",
    allowImportExportEverywhere: true,
    requireConfigFile: false,
  },
  plugins: ["prettier", "jest", "no-only-tests"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        printWidth: 99,
        parser: "flow",
      },
    ],
    "no-undef": "error",
    "no-unused-vars": ["error", { vars: "all", args: "after-used", ignoreRestSiblings: false }],
  },
  extends: ["prettier", "plugin:jest/recommended"],
  root: true,
};
