import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        display: ["Antonio", "Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        serif: ["Playfair Display", "Georgia", "serif"],
        signature: ["Mrs Saint Delafield", "cursive"],
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
        pale: {
          DEFAULT: "hsl(var(--pale) / <alpha-value>)",
          ink: "hsl(var(--pale-ink) / <alpha-value>)",
          soft: "hsl(var(--pale-soft) / <alpha-value>)",
        },
        emerald: {
          100: "hsl(var(--accent-100) / <alpha-value>)",
          200: "hsl(var(--accent-200) / <alpha-value>)",
          300: "hsl(var(--accent-300) / <alpha-value>)",
          400: "hsl(var(--accent-400) / <alpha-value>)",
          500: "hsl(var(--accent-500) / <alpha-value>)",
          900: "hsl(var(--accent-900) / <alpha-value>)",
          950: "hsl(var(--accent-950) / <alpha-value>)",
        },
        // Legacy names still used by the error page
        background: "hsl(var(--background))",
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
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
