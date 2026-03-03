import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medpact: {
          blue: "rgb(var(--medpact-blue) / <alpha-value>)",
          green: "rgb(var(--medpact-green) / <alpha-value>)",
          black: "rgb(var(--medpact-black) / <alpha-value>)",
        }
      }
    },
  },
  plugins: [],
};

export default config;
