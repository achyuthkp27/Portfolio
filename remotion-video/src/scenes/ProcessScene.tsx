import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONTS } from '../styles';
import { slideUp, scaleIn, stagger } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

const steps = [
  { number: '01', title: 'Discovery', desc: 'Requirements & Architecture Planning', color: COLORS.emerald[400], details: ['User Research', 'System Design', 'Tech Stack Selection'] },
  { number: '02', title: 'Design', desc: 'System Design & UI/UX Prototyping', color: COLORS.blue[400], details: ['Figma Prototypes', 'Component Library', 'Design Tokens'] },
  { number: '03', title: 'Development', desc: 'TDD, Clean Code & CI/CD Pipelines', color: COLORS.purple[400], details: ['Test-Driven Dev', 'Code Reviews', 'CI/CD Pipelines'] },
  { number: '04', title: 'Deployment', desc: 'Cloud Infra, Monitoring & Scale', color: COLORS.amber[400], details: ['Cloud Deploy', 'Monitoring', 'Performance Tuning'] },
];

export const ProcessScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineFill = interpolate(frame, [10, 90], [0, 100], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

  return (
    <SceneWrapper accentColor={COLORS.neon.blue}>
      <div style={{ position: 'absolute', top: 60, left: 80, ...slideUp(frame, fps, 0) }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.2em', color: `${COLORS.white}50`, textTransform: 'uppercase', padding: '6px 16px', border: `1px solid ${COLORS.white}15`, background: `${COLORS.white}08` }}>
          [ SYSTEM_WORKFLOW ]
        </span>
      </div>

      <div style={{ position: 'absolute', top: 140, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, textAlign: 'center',
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.neon.blue}30)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          ...slideUp(frame, fps, 3),
        }}>
          HOW I <span style={{ WebkitTextFillColor: `${COLORS.white}50` }}>WORK</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: '50%', left: 120, right: 120, marginTop: -40 }}>
        <div style={{ position: 'absolute', top: 28, left: 0, right: 0, height: 2, background: `${COLORS.white}08` }} />
        <div style={{ position: 'absolute', top: 28, left: 0, height: 2, width: `${lineFill}%`, background: `linear-gradient(90deg, ${COLORS.emerald[400]}80, ${COLORS.blue[400]}80, ${COLORS.purple[400]}80, ${COLORS.amber[400]}80)`, boxShadow: `0 0 10px ${COLORS.neon.cyan}20` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {steps.map((step, i) => {
            const delay = stagger(i, 12, 10);
            const isActive = frame > delay + 5;
            return (
              <div key={step.number} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 220, ...scaleIn(frame, fps, delay) }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${isActive ? step.color : `${COLORS.white}20`}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg, boxShadow: isActive ? `0 0 20px ${step.color}40, 0 0 40px ${step.color}15` : 'none', marginBottom: 20 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: isActive ? step.color : `${COLORS.white}30` }} />
                </div>
                <div style={{ padding: '20px 16px', width: '100%', background: `${COLORS.white}04`, border: `1px solid ${isActive ? step.color + '25' : COLORS.white + '08'}`, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: step.color, letterSpacing: '0.15em', marginBottom: 8 }}>{step.number}</div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 700, color: COLORS.white, marginBottom: 6 }}>{step.title}</div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 11, color: `${COLORS.white}45`, lineHeight: 1.4 }}>{step.desc}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
                    {step.details.map((d, j) => (
                      <div key={d} style={{ fontFamily: FONTS.mono, fontSize: 9, color: `${COLORS.white}30`, letterSpacing: '0.08em', ...slideUp(frame, fps, delay + 8 + j * 3) }}>▹ {d}</div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneWrapper>
  );
};
