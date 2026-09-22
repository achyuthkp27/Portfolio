import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["Antonio", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // Theme-driven: whatever the enclosing .theme-* sets
        bg: "hsl(var(--bg) / <alpha-value>)",
        fg: "hsl(var(--fg) / <alpha-value>)",
        muted: "hsl(var(--muted))",
        line: "hsl(var(--line))",
        tile: { DEFAULT: "hsl(var(--tile) / <alpha-value>)", fg: "hsl(var(--tile-fg) / <alpha-value>)" },
        // Fixed palette
        night: "hsl(var(--night) / <alpha-value>)",
        graphite: "hsl(var(--graphite) / <alpha-value>)",
        snow: "hsl(var(--snow) / <alpha-value>)",
        stone: "hsl(var(--stone) / <alpha-value>)",
        emerald: {
          100: "hsl(var(--accent-100) / <alpha-value>)",
          300: "hsl(var(--accent-300) / <alpha-value>)",
          400: "hsl(var(--accent-400) / <alpha-value>)",
          500: "hsl(var(--accent-500) / <alpha-value>)",
          900: "hsl(var(--accent-900) / <alpha-value>)",
          950: "hsl(var(--accent-950) / <alpha-value>)",
        },
        // Legacy names used by the terminal
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        pill: "999px",
      },
      boxShadow: {
        pill: "var(--shadow-pill)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
        slow: "var(--dur-slow)",
      },
      transitionTimingFunction: {
        out: "var(--ease)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
