import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, neonLine } from '../styles';
import { slideUp, typewriter } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

/**
 * OUTRO — Glitch effect, "System Online" flicker, scan lines, fade to black
 */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fade to black at the very end
  const fadeToBlack = interpolate(frame, [durationInFrames - 35, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Glitch effect — horizontal displacement that fires periodically
  const glitchActive = (frame > 10 && frame < 15) || (frame > 40 && frame < 43) || (frame > 75 && frame < 78) || (frame > 110 && frame < 113);
  const glitchX = glitchActive ? (Math.sin(frame * 50) * 8) : 0;
  const glitchClip = glitchActive
    ? `inset(${20 + Math.sin(frame * 30) * 15}% 0 ${20 + Math.cos(frame * 20) * 15}% 0)`
    : 'none';

  // System online flicker
  const flickerOpacity = (() => {
    if (frame < 50) return 0;
    if (frame < 55) return frame % 3 > 1 ? 1 : 0.2;
    if (frame < 60) return frame % 4 > 2 ? 0.7 : 1;
    return 1;
  })();

  // Scan lines overlay
  const scanLineOpacity = interpolate(frame, [0, 30], [0, 0.04], { extrapolateRight: 'clamp' });

  return (
    <SceneWrapper accentColor={COLORS.neon.purple} particles={4}>
      {/* CRT scan lines overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 80, pointerEvents: 'none',
        opacity: scanLineOpacity,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        backgroundSize: '100% 4px',
      }} />

      <div style={{ textAlign: 'center', zIndex: 10 }}>
        {/* Main name — with glitch displacement */}
        <div style={{ position: 'relative' }}>
          {/* Glitch red layer */}
          {glitchActive && (
            <div style={{
              position: 'absolute', inset: 0,
              fontFamily: FONTS.display, fontSize: 100, fontWeight: 800,
              letterSpacing: '-0.04em', lineHeight: 0.95,
              color: `${COLORS.neon.cyan}40`,
              transform: `translateX(${-glitchX}px)`,
              clipPath: glitchClip,
            }}>
              ACHYUTH KP
            </div>
          )}
          {/* Glitch blue layer */}
          {glitchActive && (
            <div style={{
              position: 'absolute', inset: 0,
              fontFamily: FONTS.display, fontSize: 100, fontWeight: 800,
              letterSpacing: '-0.04em', lineHeight: 0.95,
              color: `${COLORS.neon.purple}40`,
              transform: `translateX(${glitchX * 1.5}px)`,
              clipPath: glitchClip,
            }}>
              ACHYUTH KP
            </div>
          )}
          {/* Main text */}
          <div style={{
            fontFamily: FONTS.display, fontSize: 100, fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 0.95,
            background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.neon.cyan}30, ${COLORS.neon.purple}30)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            opacity: slideUp(frame, fps, 5).opacity,
            transform: `translateX(${glitchX * 0.3}px) ${slideUp(frame, fps, 5).transform}`,
          }}>
            ACHYUTH KP
          </div>
        </div>

        {/* Neon accent line */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0', ...slideUp(frame, fps, 12) }}>
          <div style={neonLine(COLORS.neon.purple, frame > 12 ? Math.min(180, (frame - 12) * 12) : 0)} />
        </div>

        {/* SYSTEM_ONLINE with flicker */}
        <div style={{
          fontFamily: FONTS.mono, fontSize: 14, letterSpacing: '0.25em',
          color: COLORS.neon.cyan, textTransform: 'uppercase',
          textShadow: `0 0 20px ${COLORS.neon.cyan}60, 0 0 40px ${COLORS.neon.cyan}20`,
          opacity: flickerOpacity,
        }}>
          {'> '}{typewriter('SYSTEM_ONLINE', frame, 50, 2)}
          <span style={{ opacity: frame % 16 > 8 ? 1 : 0 }}>▌</span>
        </div>

        <div style={{
          fontFamily: FONTS.mono, fontSize: 10, color: `${COLORS.white}25`,
          letterSpacing: '0.15em', marginTop: 24,
          ...slideUp(frame, fps, 80),
        }}>
          achyuthkp.dev
        </div>
      </div>

      {/* Fade to black overlay */}
      <div style={{
        position: 'absolute', inset: 0, backgroundColor: '#000000',
        opacity: fadeToBlack, zIndex: 100, pointerEvents: 'none',
      }} />
    </SceneWrapper>
  );
};
