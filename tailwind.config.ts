import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced dark theme color palette
        primary: {
          DEFAULT: "#0A0A0F", // Darker base
          light: "#141420", // Slightly lighter dark
          medium: "#1E1E2D", // Medium dark for cards
          deep: "#050508", // Very dark for contrasts
        },
        "accent-neon": {
          DEFAULT: "#FF0040", // Primary neon color (slightly more magenta)
          secondary: "#00FFBB", // Secondary neon accent
          tertiary: "#4D00FF", // Third accent for variety
          glow: "#FF004080", // Glow effect color with alpha
        },
        "text-primary": "#FFFFFF",
        "text-secondary": "#B0B0B0",
        "text-muted": "#707080",
        surface: {
          DEFAULT: "#0F0F18", // Surface background
          light: "#16161F", // Lighter surface
          card: "#1A1A25", // Card background
        },
        gradient: {
          start: "#0A0A0F",
          mid: "#141428",
          end: "#1E1E2D",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-montserrat)"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out forwards",
        "slide-up": "slideUp 0.5s ease-in-out forwards",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "scan-line": "scanLine 3s linear infinite",
        "grid-move": "gridMove 20s linear infinite",
        flicker: "flicker 2s linear infinite",
        "rotate-slow": "rotateSlow 20s linear infinite",
        "particle-float": "particleFloat 15s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSlow: {
          "0%": { opacity: "0.7" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0.7" },
        },
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
        glow: {
          "0%": { textShadow: "0 0 5px #FF0040, 0 0 10px rgba(255, 0, 64, 0.5)" },
          "100%": { textShadow: "0 0 10px #FF0040, 0 0 20px rgba(255, 0, 64, 0.7), 0 0 30px rgba(255, 0, 64, 0.4)" },
        },
        scanLine: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        gridMove: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "50px 50px" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "1",
            textShadow: "0 0 10px #FF0040, 0 0 20px #FF0040, 0 0 30px #FF0040",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: "0.4",
            textShadow: "none",
          },
        },
        rotateSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        particleFloat: {
          "0%": { transform: "translateY(0) translateX(0)" },
          "25%": { transform: "translateY(-20px) translateX(10px)" },
          "50%": { transform: "translateY(0) translateX(20px)" },
          "75%": { transform: "translateY(20px) translateX(10px)" },
          "100%": { transform: "translateY(0) translateX(0)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cyber-grid":
          "linear-gradient(to right, rgba(255, 0, 64, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 0, 64, 0.05) 1px, transparent 1px)",
        noise: "url('/textures/noise.png')",
      },
      boxShadow: {
        "neon-sm": "0 0 5px theme('colors.accent-neon.DEFAULT'), 0 0 10px rgba(255, 0, 64, 0.3)",
        "neon-md": "0 0 10px theme('colors.accent-neon.DEFAULT'), 0 0 20px rgba(255, 0, 64, 0.5)",
        "neon-lg":
          "0 0 15px theme('colors.accent-neon.DEFAULT'), 0 0 30px rgba(255, 0, 64, 0.7), 0 0 45px rgba(255, 0, 64, 0.3)",
        "neon-blue": "0 0 10px theme('colors.accent-neon.secondary'), 0 0 20px rgba(0, 255, 187, 0.5)",
        "neon-purple": "0 0 10px theme('colors.accent-neon.tertiary'), 0 0 20px rgba(77, 0, 255, 0.5)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
