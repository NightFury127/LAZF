/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      colors: {
        dark: "#000000",
        "dark-accent": "#0f0f13",

        // Gold theme colors
        gold: {
          50: "#FFFDE7",
          100: "#FFF9C4",
          200: "#FFF59D",
          300: "#FFF176",
          400: "#FFEE58",
          500: "#FFD700", // Main gold
          600: "#DAA520", // Darker gold
          700: "#B8860B",
          800: "#856404",
          900: "#624700",
        },

        // Amber theme colors
        amber: {
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#FFC107", // Main amber
          600: "#B8860B", // Dark goldenrod
          700: "#A66F00",
          800: "#7A4F01",
          900: "#533500",
        },

        // Silver accent colors
        silver: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#C0C0C0", // Main silver
          600: "#A0A0A0", // Dark silver
          700: "#757575",
          800: "#616161",
          900: "#424242",
        },

        // UI semantic colors
        primary: {
          50: "#FFFDE7",
          100: "#FFF9C4",
          200: "#FFF59D",
          300: "#FFF176",
          400: "#FFEE58",
          500: "#FFD700", // Gold
          600: "#DAA520", // Darker gold
          700: "#B8860B",
          800: "#856404",
          900: "#624700",
        },

        secondary: {
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#FFC107", // Amber
          600: "#B8860B", // Dark goldenrod
          700: "#A66F00",
          800: "#7A4F01",
          900: "#533500",
        },

        // Shadcn UI colors
        border: "hsl(240 3.7% 15.9%)",
        input: "hsl(240 3.7% 15.9%)",
        ring: "hsl(51 100% 50%)", // Gold for focus rings
        background: "hsl(0 0% 0%)", // Black
        foreground: "hsl(0 0% 100%)", // White
        muted: {
          DEFAULT: "hsl(240 3.7% 15.9%)",
          foreground: "hsl(240 5% 64.9%)",
        },
        accent: {
          DEFAULT: "hsl(0 0% 75%)", // Silver
          foreground: "hsl(0 0% 0%)", // Black
        },
        popover: {
          DEFAULT: "hsl(240 10% 3.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        card: {
          DEFAULT: "hsl(240 10% 3.9%)",
          foreground: "hsl(0 0% 98%)",
        },
      },

      boxShadow: {
        gold: "0 0 5px rgba(255, 215, 0, 0.2), 0 0 20px rgba(255, 215, 0, 0.2)",
        "gold-intense":
          "0 0 10px rgba(255, 215, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.3)",
        amber:
          "0 0 5px rgba(255, 193, 7, 0.2), 0 0 20px rgba(255, 193, 7, 0.2)",
        silver:
          "0 0 5px rgba(192, 192, 192, 0.2), 0 0 20px rgba(192, 192, 192, 0.2)",
        card: "0 4px 20px rgba(0, 0, 0, 0.25)",
        "card-hover": "0 10px 30px rgba(0, 0, 0, 0.35)",
        button: "0 4px 6px rgba(0, 0, 0, 0.1)",
        "button-hover": "0 10px 15px rgba(255, 215, 0, 0.3)",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "grid-pattern":
          "linear-gradient(to right, rgba(255, 215, 0, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 215, 0, 0.07) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(circle at center, rgba(255, 215, 0, 0.15) 0%, transparent 70%)",
        "gold-gradient": "linear-gradient(to right, #ffd700, #daa520)",
        "gold-to-amber": "linear-gradient(to right, #ffd700, #ffc107)",
        "gold-to-silver": "linear-gradient(to right, #ffd700, #c0c0c0)",
      },

      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: 0.8 },
          "50%": { opacity: 0.4 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },

      animation: {
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },

      backdropBlur: {
        xs: "2px",
      },

      borderWidth: {
        1: "1px",
      },

      spacing: {
        4.5: "1.125rem",
        13: "3.25rem",
        18: "4.5rem",
        68: "17rem",
        100: "25rem",
        104: "26rem",
        108: "27rem",
        112: "28rem",
      },
    },
  },
  plugins: [],
};
