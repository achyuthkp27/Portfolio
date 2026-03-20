// ── Shared Design Tokens ── (Cinematic Edition)

export const COLORS = {
  bg: '#000000',
  bgCard: '#0a0a0a',
  bgSubtle: '#111111',
  white: '#ffffff',
  gray: {
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  emerald: {
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
  },
  blue: {
    400: '#60a5fa',
    500: '#3b82f6',
  },
  purple: {
    400: '#a78bfa',
    500: '#8b5cf6',
  },
  amber: {
    400: '#fbbf24',
    500: '#f59e0b',
  },
  cyan: {
    400: '#22d3ee',
    500: '#06b6d4',
  },
  rose: {
    400: '#fb7185',
  },
  // Neon accent palette for cinematic effects
  neon: {
    cyan: '#00f0ff',
    purple: '#b44aff',
    blue: '#4a7dff',
    magenta: '#ff00aa',
  },
} as const;

export const FONTS = {
  display: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  mono: 'JetBrains Mono, SF Mono, Consolas, monospace',
} as const;

export const SIZES = {
  width: 1920,
  height: 1080,
} as const;

// Shared container style for all scenes
export const sceneContainer: React.CSSProperties = {
  width: SIZES.width,
  height: SIZES.height,
  backgroundColor: COLORS.bg,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  position: 'relative',
  fontFamily: FONTS.display,
};

// Grid background overlay — finer for cinematic
export const gridOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
  `,
  backgroundSize: '40px 40px',
  pointerEvents: 'none',
};

/**
 * Cinematic gradient background with depth — use inside sceneContainer
 * Creates the deep blue/black keynote feel
 */
export const cinematicBg = (accentColor: string = COLORS.neon.cyan): React.CSSProperties => ({
  position: 'absolute',
  inset: 0,
  background: `
    radial-gradient(ellipse 60% 50% at 50% 50%, ${accentColor}06 0%, transparent 70%),
    radial-gradient(ellipse 80% 60% at 20% 80%, ${COLORS.neon.purple}04 0%, transparent 50%),
    radial-gradient(ellipse 80% 60% at 80% 20%, ${COLORS.neon.blue}04 0%, transparent 50%),
    linear-gradient(180deg, #000000 0%, #050510 50%, #000000 100%)
  `,
  pointerEvents: 'none',
});

/**
 * Neon glow line — horizontal accent
 */
export const neonLine = (color: string = COLORS.neon.cyan, width: number | string = 200): React.CSSProperties => ({
  width,
  height: 1,
  background: `linear-gradient(90deg, transparent, ${color}80, ${color}, ${color}80, transparent)`,
  boxShadow: `0 0 8px ${color}40, 0 0 20px ${color}20`,
});

/**
 * Floating particle dot
 */
export const particleDot = (
  x: number, y: number, size: number, color: string, opacity: number
): React.CSSProperties => ({
  position: 'absolute',
  left: x,
  top: y,
  width: size,
  height: size,
  borderRadius: '50%',
  backgroundColor: color,
  opacity,
  pointerEvents: 'none',
  boxShadow: `0 0 ${size * 3}px ${color}`,
});
