import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F3EC", // Fond principal
        surface: "#FCFAF7", // Fond secondaire / cartes
        ink: "#121212", // Texte principal
        "ink-soft": "#5F5A54", // Texte secondaire
        line: "#E6DED3", // Bordure
        green: {
          DEFAULT: "#18C26E", // Accent vert commerce
          dense: "#14995A", // Succès
          tint: "#E4F7EE",
        },
        orange: {
          DEFAULT: "#F28C28", // Accent promo
          dense: "#D97A1E", // Alerte
          tint: "#FCEEDC",
        },
        danger: "#C94A4A", // Erreur douce
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "16px",
        lg: "20px",
        xl: "24px",
      },
      boxShadow: {
        soft: "0 6px 24px rgba(18, 18, 18, 0.06)",
        lift: "0 24px 60px rgba(18, 18, 18, 0.10)",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
