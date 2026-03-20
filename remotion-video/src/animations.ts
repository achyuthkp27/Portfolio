import { interpolate, spring, Easing } from 'remotion';

// ── Reusable Animation Helpers (Cinematic Edition) ──

/**
 * Slide up + fade in (smooth ease-out)
 */
export const slideUp = (frame: number, fps: number, delay: number = 0) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const y = interpolate(f, [0, 14], [50, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return { opacity, transform: `translateY(${y}px)` };
};

/**
 * Scale + fade in (punchy spring)
 */
export const scaleIn = (frame: number, fps: number, delay: number = 0) => {
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180 } });
  return { opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})` };
};

/**
 * Slide from left with ease
 */
export const slideLeft = (frame: number, fps: number, delay: number = 0) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const x = interpolate(f, [0, 14], [-80, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return { opacity, transform: `translateX(${x}px)` };
};

/**
 * Slide from right with ease
 */
export const slideRight = (frame: number, fps: number, delay: number = 0) => {
  const f = Math.max(0, frame - delay);
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const x = interpolate(f, [0, 14], [80, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return { opacity, transform: `translateX(${x}px)` };
};

/**
 * Progress bar fill
 */
export const progressFill = (frame: number, delay: number, target: number) => {
  const f = Math.max(0, frame - delay);
  const width = interpolate(f, [0, 20], [0, target], { extrapolateRight: 'clamp' });
  return `${width}%`;
};

/**
 * Stagger delay — returns delay for item at given index
 */
export const stagger = (index: number, baseDelay: number = 0, gap: number = 4) =>
  baseDelay + index * gap;

/**
 * Fade out at the end of a scene
 */
export const fadeOut = (frame: number, totalFrames: number, fadeFrames: number = 8) => {
  const remaining = totalFrames - frame;
  return interpolate(remaining, [0, fadeFrames], [0, 1], { extrapolateRight: 'clamp' });
};

/**
 * Counting number animation
 */
export const countUp = (frame: number, delay: number, target: number, duration: number = 20) => {
  const f = Math.max(0, frame - delay);
  return Math.round(interpolate(f, [0, duration], [0, target], { extrapolateRight: 'clamp' }));
};

/**
 * Typewriter effect
 */
export const typewriter = (text: string, frame: number, delay: number = 0, speed: number = 2) => {
  const f = Math.max(0, frame - delay);
  const chars = Math.min(text.length, Math.floor(f / speed));
  return text.slice(0, chars);
};

// ── Cinematic Transition Helpers ──

/**
 * Zoom-in entry: scene scales from 1.15 → 1.0 with fade
 * Use at the START of a scene
 */
export const zoomEntry = (frame: number, durationFrames: number = 15) => {
  const scale = interpolate(frame, [0, durationFrames], [1.15, 1.0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(frame, [0, durationFrames * 0.6], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return { opacity, transform: `scale(${scale})` };
};

/**
 * Zoom-out exit: scene scales from 1.0 → 0.9 with fade
 * Use at the END of a scene
 */
export const zoomExit = (frame: number, totalFrames: number, durationFrames: number = 12) => {
  const remaining = totalFrames - frame;
  const scale = interpolate(remaining, [0, durationFrames], [0.9, 1.0], {
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const opacity = interpolate(remaining, [0, durationFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });
  return { opacity, transform: `scale(${scale})` };
};

/**
 * Combined zoom entry + exit for a scene's master wrapper
 */
export const zoomTransition = (frame: number, totalFrames: number, entryDur: number = 15, exitDur: number = 12) => {
  const entry = zoomEntry(frame, entryDur);
  const exit = zoomExit(frame, totalFrames, exitDur);
  const opacity = entry.opacity * exit.opacity;

  // Parse scales
  const entryScale = 1 + (1.15 - 1) * Math.max(0, 1 - frame / entryDur);
  const remaining = totalFrames - frame;
  const exitScale = remaining < exitDur ? 0.9 + 0.1 * (remaining / exitDur) : 1;
  const scale = frame < entryDur ? entryScale : exitScale;

  return { opacity, transform: `scale(${scale.toFixed(4)})` };
};

/**
 * Parallax float — gentle oscillation for depth
 */
export const parallaxFloat = (frame: number, amplitude: number = 8, speed: number = 0.03) => {
  const y = Math.sin(frame * speed) * amplitude;
  const x = Math.cos(frame * speed * 0.7) * (amplitude * 0.5);
  return { transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)` };
};

/**
 * Floating particle position over time
 */
export const floatingParticle = (
  frame: number,
  baseX: number, baseY: number,
  ampX: number = 20, ampY: number = 15,
  speedX: number = 0.02, speedY: number = 0.015,
  phase: number = 0,
) => ({
  left: baseX + Math.sin(frame * speedX + phase) * ampX,
  top: baseY + Math.cos(frame * speedY + phase) * ampY,
});

/**
 * Blur transition value — returns blur amount in px (for transition overlays)
 */
export const transitionBlur = (frame: number, totalFrames: number, blurFrames: number = 10) => {
  const entryBlur = interpolate(frame, [0, blurFrames], [8, 0], { extrapolateRight: 'clamp' });
  const remaining = totalFrames - frame;
  const exitBlur = interpolate(remaining, [0, blurFrames], [8, 0], { extrapolateRight: 'clamp' });
  return Math.max(entryBlur, exitBlur);
};
