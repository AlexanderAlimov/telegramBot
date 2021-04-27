module.exports = {
  env: {
    es2021: true,
    node: true,
    es6: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 4],
    quotes: ["error", "single"],
    semi: ["error", "always"],
    eqeqeq: ["error", "always"],
  },
  globals: {
    __dirname: true,
  },
};
