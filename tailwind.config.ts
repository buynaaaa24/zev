import type { Config } from "tailwindcss";

// ─────────────────────────────────────────────
//  ZEVTABS — Apple-inspired design system
//  neutral = clean blacks & whites (Apple style)
//  accent  = electric blue (#0066CC Apple blue)
// ─────────────────────────────────────────────
const neutral = {
  0:   "#ffffff",
  50:  "#f5f5f7", // Apple light gray bg
  100: "#e8e8ed",
  200: "#d2d2d7",
  300: "#aeaeb2",
  400: "#86868b", // Apple secondary text
  500: "#6e6e73",
  600: "#3d3d3f",
  700: "#2d2d2f",
  800: "#1d1d1f", // Apple dark text
  900: "#0a0a0a",
  950: "#000000",
};

const accent = {
  50:  "#e8f0fd",
  100: "#bdd4f9",
  200: "#92b8f5",
  300: "#5592ef",
  400: "#2f77e8",
  500: "#0066CC", // Apple blue
  600: "#0056b3",
  700: "#00439e",
};

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        neutral,
        accent,
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: {
            DEFAULT: "var(--sidebar-primary)",
            foreground: "var(--sidebar-primary-foreground)",
          },
          accent: {
            DEFAULT: "var(--sidebar-accent)",
            foreground: "var(--sidebar-accent-foreground)",
          },
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(40px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-up":       "fadeUp 0.7s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "fade-in":       "fadeIn 0.6s ease both",
        "scale-in":      "scaleIn 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both",
        float:           "float 6s ease-in-out infinite",
        "gradient-shift":"gradientShift 8s ease infinite",
      },
      backgroundSize: {
        "200%": "200%",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
