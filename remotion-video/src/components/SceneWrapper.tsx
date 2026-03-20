import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, sceneContainer, gridOverlay, cinematicBg, particleDot } from '../styles';
import { zoomTransition, transitionBlur, floatingParticle } from '../animations';

/**
 * SceneWrapper — cinematic wrapper for every scene:
 * - Zoom-in entry / zoom-out exit
 * - Motion blur during transitions
 * - Cinematic depth background gradient
 * - Floating ambient particles
 * - Subtle film grain
 * - Light leak / sweep effect
 * - Grid overlay
 * - Slow scan line
 */

interface Props {
  children: React.ReactNode;
  accentColor?: string;
  particles?: number;
  /** Disable light leak sweep */
  noLightLeak?: boolean;
}

const PARTICLE_SEEDS = [
  { x: 150, y: 200, size: 3, amp: 15, speed: 0.02, phase: 0 },
  { x: 1700, y: 150, size: 2, amp: 20, speed: 0.015, phase: 1.2 },
  { x: 400, y: 800, size: 2, amp: 12, speed: 0.025, phase: 2.5 },
  { x: 1500, y: 700, size: 3, amp: 18, speed: 0.018, phase: 0.8 },
  { x: 900, y: 100, size: 2, amp: 10, speed: 0.03, phase: 3.1 },
  { x: 200, y: 600, size: 2, amp: 14, speed: 0.022, phase: 1.7 },
  { x: 1600, y: 500, size: 3, amp: 16, speed: 0.02, phase: 4.0 },
  { x: 800, y: 900, size: 2, amp: 10, speed: 0.028, phase: 2.2 },
];

export const SceneWrapper: React.FC<Props> = ({
  children,
  accentColor = COLORS.neon.cyan,
  particles = 6,
  noLightLeak = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Zoom transition
  const zoom = zoomTransition(frame, durationInFrames, 15, 12);

  // Motion blur
  const blur = transitionBlur(frame, durationInFrames, 10);

  // Light leak sweep — diagonal shine crossing the screen
  const leakPos = interpolate(frame, [8, durationInFrames - 15], [-30, 130], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <div style={sceneContainer}>
      {/* Cinematic depth background */}
      <div style={cinematicBg(accentColor)} />

      {/* Grid overlay */}
      <div style={gridOverlay} />

      {/* Floating ambient particles */}
      {PARTICLE_SEEDS.slice(0, particles).map((seed, i) => {
        const pos = floatingParticle(
          frame, seed.x, seed.y, seed.amp, seed.amp * 0.8,
          seed.speed, seed.speed * 0.7, seed.phase,
        );
        return (
          <div
            key={i}
            style={particleDot(
              pos.left, pos.top, seed.size, accentColor,
              0.15 + Math.sin(frame * 0.04 + seed.phase) * 0.1,
            )}
          />
        );
      })}

      {/* Slow scan line */}
      <div style={{
        position: 'absolute',
        top: (frame * 3) % 1080,
        left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent 20%, ${accentColor}06, transparent 80%)`,
        pointerEvents: 'none',
      }} />

      {/* Light leak / sweep — diagonal shine */}
      {!noLightLeak && (
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 50,
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%', left: `${leakPos}%`,
            width: '8%', height: '200%',
            background: `linear-gradient(90deg, transparent, ${accentColor}06, ${COLORS.white}03, ${accentColor}06, transparent)`,
            transform: 'rotate(15deg)',
            filter: 'blur(30px)',
          }} />
        </div>
      )}

      {/* Film grain overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.03,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        zIndex: 60,
      }} />

      {/* Content with zoom + blur transition */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        ...zoom,
        filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : 'none',
      }}>
        {children}
      </div>
    </div>
  );
};
