import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#08070f",
        surface: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",
        violet: {
          DEFAULT: "#7c5cff",
          soft: "#a48bff",
        },
        magenta: "#e14bd6",
        azure: "#3fa9f5",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.5rem",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "0.9" },
        },
      },
      animation: {
        rise: "rise 0.6s ease-out both",
        glow: "glow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
