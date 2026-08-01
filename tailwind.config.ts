import type { Config } from "tailwindcss";

const config: Config = {
  // Only process files that actually use Tailwind — keeps bundle lean
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Class-based dark mode so next-themes can control it reliably
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        // Brand palette — deep indigo-violet with warm gold accent
        // Chosen to feel premium and musical without being garish
        brand: {
          50: "#f0f0ff",
          100: "#e4e3ff",
          200: "#cccbff",
          300: "#a9a6ff",
          400: "#8078fd",
          500: "#6147f9",
          600: "#5229f0",
          700: "#4519dc",
          800: "#3914b8",
          900: "#301296",
          950: "#1c0869",
        },
        accent: {
          // Warm amber-gold for highlights — pairs well with the indigo brand
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        surface: {
          // Neutral surfaces — slightly warm to complement the indigo
          0: "#ffffff",
          50: "#fafafa",
          100: "#f5f4f7",
          200: "#ece9f0",
          300: "#d8d4e0",
          dark: {
            0: "#0d0b14",
            50: "#13101e",
            100: "#1a1628",
            200: "#241f35",
            300: "#2f2945",
          },
        },
      },

      fontFamily: {
        // Playfair Display for display headings — elegant, editorial
        // Inter for body — clean, legible, modern
        // Both loaded via next/font for zero layout shift
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },

      backgroundImage: {
        // Subtle noise texture overlay for depth without heaviness
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(97, 71, 249, 0.18) 0%, transparent 60%)",
        "hero-gradient-dark":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(97, 71, 249, 0.28) 0%, transparent 60%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
      },

      boxShadow: {
        // Layered shadows for depth — lifted from real premium SaaS design systems
        card: "0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.03)",
        "card-hover":
          "0 2px 6px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06), 0 24px 48px rgba(0,0,0,0.04)",
        "card-dark":
          "0 1px 3px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.2), 0 16px 32px rgba(0,0,0,0.15)",
        "card-dark-hover":
          "0 2px 6px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.25), 0 24px 48px rgba(0,0,0,0.2)",
        glow: "0 0 24px rgba(97, 71, 249, 0.3)",
        "glow-sm": "0 0 12px rgba(97, 71, 249, 0.2)",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        shimmer: "shimmer 1.8s infinite linear",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },

      transitionTimingFunction: {
        // Spring-like easing for natural feel
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },

  plugins: [],
};

export default config;
