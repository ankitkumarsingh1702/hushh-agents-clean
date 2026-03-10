import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      colors: {
        brand: {
          primary: "#ff5864",
          dark: "#0a0a0a",
        },
      },
      borderRadius: {
        custom: "8px",
      },
    },
  },
  plugins: [],
} satisfies Config;
