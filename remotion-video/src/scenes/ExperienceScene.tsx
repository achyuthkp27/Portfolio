import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONTS } from '../styles';
import { slideUp, slideLeft, slideRight, stagger, parallaxFloat, countUp } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

const achievements = [
  'Developed 25+ high-performance RESTful APIs for banking platforms',
  'Led ELK stack integration — 25% faster issue resolution',
  'Optimized deployment for SIT, UAT, and Production environments',
  'Integrated ReactJS frontend for seamless banking UX',
];
const techStack = ['Spring Boot', 'Microservices', 'Kafka', 'ELK Stack', 'ReactJS', 'Docker', 'AWS'];

// Big metrics for count-up animation — dashboard style
const metrics = [
  { value: 25, suffix: '+', label: 'APIs BUILT', color: COLORS.emerald[400] },
  { value: 25, suffix: '%', label: 'FASTER DEBUG', color: COLORS.blue[400] },
  { value: 4, suffix: '+', label: 'YEARS', color: COLORS.neon.cyan },
];

/**
 * EXPERIENCE — Big bold count-up numbers first, enterprise dashboard look
 */
export const ExperienceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneWrapper accentColor={COLORS.emerald[400]}>
      <div style={{ position: 'absolute', top: 60, left: 80, ...slideUp(frame, fps, 0) }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.2em', color: `${COLORS.white}50`, textTransform: 'uppercase', padding: '6px 16px', border: `1px solid ${COLORS.white}15`, background: `${COLORS.white}08` }}>
          [ EXPERIENCE_LOG ]
        </span>
      </div>

      {/* Big count-up metrics row — dashboard style */}
      <div style={{
        position: 'absolute', top: 130, left: 80, right: 80,
        display: 'flex', gap: 24,
      }}>
        {metrics.map((m, i) => {
          const delay = 5 + i * 8;
          const entryScale = interpolate(frame, [delay, delay + 15], [0.7, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: Easing.out(Easing.cubic) });
          const entryOpacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: 'clamp' });
          return (
            <div key={m.label} style={{
              flex: 1, padding: '28px 24px', background: `${COLORS.white}04`,
              border: `1px solid ${COLORS.white}08`, borderRadius: 20,
              textAlign: 'center', borderBottom: `2px solid ${m.color}30`,
              opacity: entryOpacity, transform: `scale(${entryScale})`,
            }}>
              <div style={{
                fontFamily: FONTS.display, fontSize: 56, fontWeight: 900,
                color: m.color, lineHeight: 1,
                textShadow: `0 0 30px ${m.color}25`,
              }}>
                {countUp(frame, delay + 5, m.value, 25)}{m.suffix}
              </div>
              <div style={{
                fontFamily: FONTS.mono, fontSize: 10, color: `${COLORS.white}40`,
                letterSpacing: '0.15em', marginTop: 10,
              }}>
                {m.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role + details below metrics */}
      <div style={{ display: 'flex', gap: 60, padding: '0 100px', width: '100%', alignItems: 'flex-start', marginTop: 140 }}>
        <div style={{ flex: '0 0 380px', ...parallaxFloat(frame, 4, 0.015) }}>
          <div style={{
            fontFamily: FONTS.display, fontSize: 48, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1,
            background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.emerald[400]}40)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            ...slideLeft(frame, fps, 18),
          }}>FIS<br />GLOBAL</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.emerald[400], letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 16, textShadow: `0 0 20px ${COLORS.emerald[400]}30`, ...slideLeft(frame, fps, 25) }}>SOFTWARE ENGINEER</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, ...slideLeft(frame, fps, 30) }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: `${COLORS.white}40`, padding: '4px 12px', border: `1px solid ${COLORS.white}10`, borderRadius: 6, background: `${COLORS.white}05` }}>2021 – PRESENT</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.emerald[400], padding: '4px 12px', border: `1px solid ${COLORS.emerald[500]}30`, borderRadius: 6, background: `${COLORS.emerald[500]}10` }}>ACTIVE</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 24 }}>
            {techStack.map((tech, i) => (
              <span key={tech} style={{
                fontFamily: FONTS.mono, fontSize: 9, padding: '5px 10px',
                border: `1px solid ${COLORS.emerald[500]}25`, color: COLORS.emerald[400],
                borderRadius: 6, letterSpacing: '0.1em', textTransform: 'uppercase',
                background: `${COLORS.emerald[500]}08`,
                ...slideUp(frame, fps, stagger(i, 35, 3)),
              }}>{tech}</span>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: `${COLORS.white}30`, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16, ...slideRight(frame, fps, 20) }}>KEY ACHIEVEMENTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {achievements.map((ach, i) => {
              const d = stagger(i, 28, 6);
              const entryOpacity = interpolate(frame, [d, d + 10], [0, 1], { extrapolateRight: 'clamp' });
              const entryX = interpolate(frame, [d, d + 12], [40, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px',
                  background: `${COLORS.white}03`, border: `1px solid ${COLORS.white}08`,
                  borderRadius: 12, borderLeft: `2px solid ${COLORS.emerald[400]}40`,
                  opacity: entryOpacity, transform: `translateX(${entryX}px)`,
                }}>
                  <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.emerald[400], marginTop: 3, flexShrink: 0 }}>▹</span>
                  <span style={{ fontFamily: FONTS.display, fontSize: 13, color: `${COLORS.white}75`, lineHeight: 1.6 }}>{ach}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
};
