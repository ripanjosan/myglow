import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        glow: {
          pink: "#F9C6D0",
          "pink-deep": "#F0A3B5",
          lavender: "#C8B6E2",
          "lavender-deep": "#A990D0",
          cream: "#FFF8F5",
          gold: "#D4A853",
          "gold-light": "#F0D08A",
          blush: "#FDEEF2",
          mist: "#F4F0FA",
          rose: "#E8748A",
        },
        dark: {
          bg: "#0F0A14",
          surface: "#1A1025",
          card: "#221633",
          border: "#3D2B55",
          text: "#F0E8FF",
          muted: "#9B88B8",
        }
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Plus Jakarta Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "glow-gradient": "linear-gradient(135deg, #F9C6D0 0%, #C8B6E2 50%, #FFF8F5 100%)",
        "dark-gradient": "linear-gradient(135deg, #1A1025 0%, #0F0A14 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(249,198,208,0.15) 0%, rgba(200,182,226,0.15) 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4A853 0%, #F0D08A 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 8px 32px rgba(249,198,208,0.25), 0 2px 8px rgba(200,182,226,0.15)",
        "glow-lg": "0 16px 48px rgba(249,198,208,0.3), 0 4px 16px rgba(200,182,226,0.2)",
        "dark-glow": "0 8px 32px rgba(169,144,208,0.2), 0 2px 8px rgba(139,96,184,0.1)",
        gold: "0 4px 20px rgba(212,168,83,0.3)",
        card: "0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulse-soft 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "slide-up": "slide-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "spin-slow": "spin 8s linear infinite",
        "ring-fill": "ring-fill 1.5s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "ring-fill": {
          "0%": { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "var(--dash-offset)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
