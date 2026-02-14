import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#0F0F0F",
          secondary: "#1A1A1A",
          card: "#1F1F1F",
        },
        purple: {
          dark: "#6B21A8",
          primary: "#7C3AED",
          light: "#8B5CF6",
          accent: "#A78BFA",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#A0A0A0",
        },
        border: {
          default: "#2D2D2D",
        },
      },
      backgroundImage: {
        "gradient-purple": "linear-gradient(135deg, #6B21A8 0%, #7C3AED 50%, #8B5CF6 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
