import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, sceneContainer } from '../styles';

/**
 * INTRO — Premium kinetic typography.
 *
 * Letters reveal from outline to gradient-fill with neon glow.
 * Deep cinematic background, refined color palette.
 */

const NEON_CYAN = '#00e5ff';
const NEON_PURPLE = '#b44aff';

// ── Kinetic letter component ──
const KineticWord: React.FC<{
  word: string; startFrame: number; stagger: number;
  fontSize: number; weight: number; frame: number;
  accentColor?: string; spacing?: string; dotAfter?: boolean;
}> = ({ word, startFrame, stagger, fontSize, weight, frame, accentColor = NEON_CYAN, spacing = '0.02em', dotAfter }) => (
  <>
    {[...word].map((char, i) => {
      const charStart = startFrame + i * stagger;
      const fill = interpolate(frame, [charStart, charStart + 12], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      });
      const appear = interpolate(frame, [charStart - 3, charStart + 5], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      });

      // Stroke fades as fill comes in
      const strokeOpacity = (1 - fill * 0.8).toFixed(2);

      // Per-letter color: white → cool silver → muted lavender
      const ratio = word.length > 1 ? i / (word.length - 1) : 0;
      const r = Math.round(255 - ratio * 105);  // 255 → 150
      const g = Math.round(255 - ratio * 120);  // 255 → 135
      const b = Math.round(255 - ratio * 55);   // 255 → 200  (stays blue-ish = cool)
      const fillColor = `rgba(${r},${g},${b},${fill.toFixed(2)})`;

      // Subtle glow
      const glowIntensity = Math.round(fill * 15);

      return (
        <span key={i} style={{
          fontFamily: FONTS.display, fontSize, fontWeight: weight,
          letterSpacing: spacing, lineHeight: 1,
          color: 'transparent',
          WebkitTextStroke: `1.5px rgba(200,180,255,${strokeOpacity})`,
          WebkitTextFillColor: fillColor,
          textShadow: glowIntensity > 2 ? `0 0 ${glowIntensity}px ${accentColor}25` : 'none',
          opacity: appear, display: 'inline-block',
        }}>
          {char}
        </span>
      );
    })}
    {dotAfter && (() => {
      const dotStart = startFrame + word.length * stagger + 2;
      const dotFill = interpolate(frame, [dotStart, dotStart + 8], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      });
      return (
        <span style={{
          fontFamily: FONTS.display, fontSize,
          fontWeight: weight, lineHeight: 1,
          color: 'transparent',
          WebkitTextFillColor: accentColor,
          WebkitTextStroke: 'none',
          opacity: dotFill,
          display: 'inline-block',
          margin: '0 10px 0 2px',
          textShadow: `0 0 12px ${accentColor}50`,
        }}>.</span>
      );
    })()}
  </>
);

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // ── Phase transitions ──
  const phase2Progress = interpolate(frame, [50, 85], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const mainY = interpolate(phase2Progress, [0, 1], [20, -70]);
  const mainScale = interpolate(phase2Progress, [0, 1], [1, 0.8]);

  // Subtitle — synced to voiceover "Full Stack Engineer" (~2s mark)
  const subOpacity = interpolate(frame, [60, 80], [0, 0.7], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const subY = interpolate(frame, [60, 80], [12, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Tags
  const tags = [
    { label: 'SPRING BOOT', color: NEON_CYAN },
    { label: 'REACT', color: NEON_CYAN },
    { label: 'KAFKA', color: NEON_PURPLE },
    { label: 'AWS', color: NEON_PURPLE },
    { label: 'DOCKER', color: NEON_CYAN },
  ];
  const tagsStart = 120;

  // Decorative elements
  const lineWidth = interpolate(frame, [85, 140], [0, 500], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const plusOpacity = interpolate(frame, [60, 80], [0, 0.1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const plusScale = interpolate(frame, [60, 80], [0.6, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{
      ...sceneContainer,
      backgroundColor: '#050510',
      overflow: 'hidden',
    }}>
      {/* Cinematic depth */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 60% 50% at 50% 45%, rgba(10,20,60,0.9) 0%, transparent 70%),
          radial-gradient(ellipse 40% 30% at 55% 50%, ${NEON_CYAN}05 0%, transparent 55%),
          radial-gradient(ellipse 35% 25% at 40% 48%, ${NEON_PURPLE}04 0%, transparent 50%)
        `,
        pointerEvents: 'none',
      }} />
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* ── Name block ── */}
      <div style={{
        transform: `translateY(${mainY}px) scale(${mainScale})`,
        display: 'flex', alignItems: 'baseline', justifyContent: 'center',
        flexWrap: 'wrap',
        position: 'relative', zIndex: 10,
      }}>
        <KineticWord
          word="ACHYUTH" startFrame={8} stagger={4}
          fontSize={150} weight={800} frame={frame}
          accentColor={NEON_CYAN} spacing="0.03em" dotAfter
        />
        <KineticWord
          word="KP" startFrame={55} stagger={5}
          fontSize={150} weight={800} frame={frame}
          accentColor={NEON_PURPLE} spacing="0.03em"
        />
      </div>

      {/* "+" decorative */}
      <div style={{
        position: 'absolute', top: '27%', right: '11%',
        fontFamily: FONTS.display, fontSize: 55, fontWeight: 200,
        color: NEON_CYAN, opacity: plusOpacity,
        transform: `scale(${plusScale})`,
        textShadow: `0 0 15px ${NEON_CYAN}20`,
        zIndex: 5,
      }}>+</div>

      {/* Horizontal accent line */}
      <div style={{
        width: lineWidth, height: 1,
        background: `linear-gradient(90deg, transparent 5%, ${NEON_CYAN}30, ${NEON_PURPLE}20, transparent 95%)`,
        marginTop: -15, zIndex: 10,
      }} />

      {/* Subtitle */}
      <div style={{
        fontFamily: FONTS.mono, fontSize: 12,
        letterSpacing: '0.4em',
        color: NEON_CYAN,
        textTransform: 'uppercase',
        opacity: subOpacity,
        transform: `translateY(${subY}px)`,
        marginTop: 26,
        textShadow: `0 0 20px ${NEON_CYAN}20`,
        zIndex: 10,
      }}>
        Full Stack Engineer
      </div>

      {/* Tags */}
      <div style={{
        display: 'flex', gap: 14, marginTop: 28,
        justifyContent: 'center', zIndex: 10,
      }}>
        {tags.map((tag, i) => {
          const tagStart = tagsStart + i * 5;
          const tagOpacity = interpolate(frame, [tagStart, tagStart + 12], [0, 0.5], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          const tagY = interpolate(frame, [tagStart, tagStart + 12], [6, 0], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          return (
            <span key={tag.label} style={{
              fontFamily: FONTS.mono, fontSize: 9,
              letterSpacing: '0.12em',
              padding: '5px 14px',
              border: `1px solid ${tag.color}18`,
              color: `${tag.color}90`,
              borderRadius: 6,
              background: `${tag.color}06`,
              opacity: tagOpacity,
              transform: `translateY(${tagY}px)`,
            }}>
              {tag.label}
            </span>
          );
        })}
      </div>

      {/* Available for Work — bottom left */}
      <div style={{
        position: 'absolute', bottom: 56, left: 80,
        display: 'flex', alignItems: 'center', gap: 8,
        opacity: interpolate(frame, [140, 160], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        zIndex: 10,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          backgroundColor: '#34d399',
          boxShadow: '0 0 10px #34d39960',
        }} />
        <span style={{
          fontFamily: FONTS.mono, fontSize: 9,
          letterSpacing: '0.2em', color: '#34d39990',
          textTransform: 'uppercase',
        }}>
          Available for Work
        </span>
      </div>

      {/* Experience card — bottom right */}
      <div style={{
        position: 'absolute', bottom: 44, right: 80,
        padding: '16px 24px',
        border: `1px solid ${NEON_CYAN}12`,
        background: `${NEON_CYAN}05`,
        borderRadius: 14, textAlign: 'center',
        opacity: interpolate(frame, [150, 170], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `translateY(${interpolate(frame, [150, 170], [8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) })}px)`,
        zIndex: 10,
      }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: 800, color: COLORS.white, textShadow: `0 0 15px ${NEON_CYAN}15` }}>4+</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 8, color: `${NEON_CYAN}60`, letterSpacing: '0.2em', marginTop: 4 }}>YEARS EXPERIENCE</div>
      </div>
    </div>
  );
};
