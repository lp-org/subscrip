module.exports = {
  extends: ["next", "turbo", "prettier"],
  rules: {
    "import/no-anonymous-default-export": "none",
    "@next/next/no-html-link-for-pages": "off",
  },
};
