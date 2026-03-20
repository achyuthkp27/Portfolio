import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../styles';
import { slideUp, slideLeft, slideRight, scaleIn, stagger, parallaxFloat } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

const personas = [
  { title: 'THE HUMAN_ENTITY', subtitle: 'Simply, Achyuth', desc: 'A curious mind exploring the intersection of technology, art, and human connection.', keywords: ['EMPATHY', 'CURIOSITY', 'COLLABORATION', 'LEARNING'], color: COLORS.emerald[400] },
  { title: 'THE OPERATOR_CORE', subtitle: 'Architect of Systems', desc: 'Executing precise, scalable solutions for enterprise-grade infrastructure.', keywords: ['ARCHITECTURE', 'SCALABILITY', 'INFRASTRUCTURE', 'SECURITY'], color: COLORS.blue[400] },
  { title: 'THE CREATOR_NODE', subtitle: 'Visionary Artist', desc: 'Pushing boundaries of visual design and interactive experiences.', keywords: ['UI/UX_DESIGN', 'INTERACTIVE', 'AESTHETICS', 'MOTION'], color: '#fb923c' },
];

const stats = [
  { value: '5+', label: 'YEARS_ACTIVE', color: COLORS.emerald[400] },
  { value: '50+', label: 'DEPLOYED_NODES', color: COLORS.blue[400] },
  { value: '30+', label: 'SATISFIED_CLIENTS', color: COLORS.amber[400] },
];

const highlights = [
  { label: 'ARCHITECTURE', value: 'CLEAN_PROSE' },
  { label: '25+ SERVICES', value: 'DISTRIBUTED' },
  { label: 'AWS_CERTIFIED', value: 'CLOUD_NATIVE' },
  { label: 'LATENCY_MIN', value: 'PERFORMANCE' },
];

export const AboutScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneWrapper accentColor={COLORS.neon.purple}>
      <div style={{ position: 'absolute', top: 60, left: 80, ...slideUp(frame, fps, 0) }}>
        <span style={{
          fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.2em',
          color: `${COLORS.white}50`, textTransform: 'uppercase',
          padding: '6px 16px', border: `1px solid ${COLORS.white}15`, background: `${COLORS.white}08`,
        }}>
          [ IDENTITY_MATRIX ]
        </span>
      </div>

      <div style={{ position: 'absolute', top: 110, left: 80, ...slideUp(frame, fps, 3) }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 64, fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1,
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.neon.purple}40)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          ABOUT<br /><span style={{ WebkitTextFillColor: `${COLORS.white}50` }}>ME</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 40, padding: '0 80px', width: '100%', marginTop: 80 }}>
        <div style={{ flex: '0 0 520px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {personas.map((p, i) => (
            <div key={p.title} style={{
              display: 'flex', alignItems: 'flex-start', gap: 16,
              padding: '18px 22px', background: `${COLORS.white}04`,
              border: `1px solid ${COLORS.white}08`, borderLeft: `3px solid ${p.color}`,
              borderRadius: 14, ...slideLeft(frame, fps, stagger(i, 8, 6)),
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', marginTop: 4, backgroundColor: p.color, boxShadow: `0 0 12px ${p.color}`, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: p.color, letterSpacing: '0.08em' }}>{p.title}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 12, color: `${COLORS.white}60`, marginTop: 2, fontStyle: 'italic' }}>{p.subtitle}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 11, color: `${COLORS.white}40`, marginTop: 6, lineHeight: 1.5 }}>{p.desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {p.keywords.map((kw) => (
                    <span key={kw} style={{ fontFamily: FONTS.mono, fontSize: 8, letterSpacing: '0.1em', padding: '2px 8px', borderRadius: 4, border: `1px solid ${COLORS.white}08`, color: `${COLORS.white}30` }}>{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, ...parallaxFloat(frame, 5, 0.02) }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
            {stats.map((stat, i) => (
              <div key={stat.label} style={{
                flex: 1, padding: '24px 20px', background: `${COLORS.white}04`,
                border: `1px solid ${COLORS.white}08`, borderRadius: 14, textAlign: 'center',
                ...scaleIn(frame, fps, stagger(i, 14, 4)),
              }}>
                <div style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: `${COLORS.white}40`, letterSpacing: '0.12em', marginTop: 8 }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {highlights.map((h, i) => (
              <div key={h.label} style={{
                padding: '16px 18px', background: `${COLORS.white}03`,
                border: `1px solid ${COLORS.white}06`, borderRadius: 12,
                ...slideRight(frame, fps, stagger(i, 22, 4)),
              }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: `${COLORS.white}50`, letterSpacing: '0.1em' }}>{h.label}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: `${COLORS.white}25`, letterSpacing: '0.08em', marginTop: 4 }}>{h.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
};
