import baseConfig from "../../tailwind.base.js";

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "../ui/src/**/*.{js,ts,jsx,tsx}"],
};
