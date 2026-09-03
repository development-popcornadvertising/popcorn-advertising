/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  plugins: ["prettier-plugin-tailwindcss"],
  // Tailwind v4 is configured in CSS, so the sorter must read our @theme block
  // to recognise custom utilities like `bg-pop` and `py-section`.
  tailwindStylesheet: "./src/styles/globals.css",
  tailwindFunctions: ["cn", "cva"],
};

export default config;
