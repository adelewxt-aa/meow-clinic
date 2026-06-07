import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1A1A",
        cream: "#FFFFFF",
        mist: "#F5F5F5",
        line: "#E5E5E5",
        accent: {
          DEFAULT: "#FF6B35",
          deep: "#E85A2A",
          soft: "#FFE9DF",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        "input-focus": "0 6px 22px -8px rgba(255, 107, 53, 0.38)",
        "btn-glow": "0 16px 44px -12px rgba(255, 107, 53, 0.65)",
      },
      keyframes: {
        "paw-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "rise": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "paw-spin": "paw-spin 1.4s linear infinite",
        "rise": "rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
