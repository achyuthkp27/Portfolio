import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONTS, neonLine } from '../styles';
import { slideUp, scaleIn, parallaxFloat } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

const links = [
  { label: 'EMAIL', value: 'achyuthkp27@gmail.com' },
  { label: 'GITHUB', value: 'github.com/achyuthkp27' },
  { label: 'LINKEDIN', value: 'linkedin.com/in/achyuthkp' },
  { label: 'PORTFOLIO', value: 'achyuthkp.dev' },
];

/**
 * CONTACT — Bold CTA with pulsing glow that intensifies, slow zoom-in
 */
export const ContactScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Slow zoom-in throughout scene
  const zoomIn = interpolate(frame, [0, durationInFrames], [1, 1.05], { extrapolateRight: 'clamp' });

  // Pulse glow intensity — oscillates and intensifies over time
  const pulseBase = interpolate(frame, [0, durationInFrames * 0.6], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = pulseBase * (0.6 + Math.sin(frame * 0.15) * 0.4);
  const glowStrength = Math.round(20 + pulse * 30);

  return (
    <SceneWrapper accentColor={COLORS.neon.cyan}>
      <div style={{
        textAlign: 'center', zIndex: 10,
        ...parallaxFloat(frame, 3, 0.01),
        transform: `${parallaxFloat(frame, 3, 0.01).transform} scale(${zoomIn})`,
      }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.3em',
          color: COLORS.neon.cyan, textTransform: 'uppercase', marginBottom: 30,
          textShadow: `0 0 20px ${COLORS.neon.cyan}30`,
          ...slideUp(frame, fps, 0),
        }}>
          INITIATING CONNECTION
        </div>

        {/* Bold CTA — with pulsing glow */}
        <div style={{
          fontFamily: FONTS.display, fontSize: 72, fontWeight: 800,
          letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 30,
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.neon.cyan}50)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textShadow: `0 0 ${glowStrength}px ${COLORS.neon.cyan}${Math.round(pulse * 30).toString(16).padStart(2, '0')}`,
          ...slideUp(frame, fps, 5),
        }}>
          LET'S BUILD<br />SOMETHING GREAT.
        </div>

        {/* Neon accent line — pulses */}
        <div style={{
          display: 'flex', justifyContent: 'center', margin: '10px 0 40px',
          ...slideUp(frame, fps, 10),
        }}>
          <div style={{
            ...neonLine(COLORS.neon.cyan, frame > 10 ? Math.min(160, (frame - 10) * 10) : 0),
            boxShadow: `0 0 ${8 + pulse * 10}px ${COLORS.neon.cyan}${Math.round(40 + pulse * 30).toString(16)}`,
          }} />
        </div>

        {/* Contact links */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          {links.map((link, i) => {
            const delay = 15 + i * 4;
            const cardScale = interpolate(frame, [delay, delay + 12], [0.7, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.cubic) });
            const cardOpacity = interpolate(frame, [delay, delay + 10], [0, 1], { extrapolateRight: 'clamp' });
            return (
              <div key={link.label} style={{
                padding: '18px 28px', background: `${COLORS.white}04`,
                border: `1px solid ${COLORS.white}10`, borderRadius: 16,
                opacity: cardOpacity, transform: `scale(${cardScale})`,
              }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.neon.cyan, letterSpacing: '0.2em', marginBottom: 8 }}>{link.label}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: `${COLORS.white}60`, letterSpacing: '0.05em' }}>{link.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneWrapper>
  );
};
