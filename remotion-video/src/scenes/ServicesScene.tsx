import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS, neonLine } from '../styles';
import { slideUp, slideLeft, scaleIn, stagger, parallaxFloat } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

const services = [
  { number: '01', title: 'Web Engineering', desc: 'Building scalable, high-performance web applications with modern tech stacks.', tags: ['React/Next.js', 'TypeScript', 'Node.js'], color: COLORS.emerald[400] },
  { number: '02', title: 'UI/UX Design', desc: 'Crafting intuitive and visually stunning interfaces that users love.', tags: ['Figma', 'Design Systems', 'Prototyping'], color: COLORS.blue[400] },
  { number: '03', title: 'Creative Development', desc: 'Adding life to the web with complex animations and immersive 3D experiences.', tags: ['GSAP/Framer', 'Three.js', 'WebGL'], color: COLORS.purple[400] },
];

export const ServicesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneWrapper accentColor={COLORS.neon.blue}>
      <div style={{ position: 'absolute', top: 60, left: 80, ...slideUp(frame, fps, 0) }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.2em', color: `${COLORS.white}50`, textTransform: 'uppercase', padding: '6px 16px', border: `1px solid ${COLORS.white}15`, background: `${COLORS.white}08` }}>
          [ CREATIVE_ENGINEERING ]
        </span>
      </div>

      <div style={{ position: 'absolute', top: 120, left: 80, ...slideLeft(frame, fps, 3) }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 72, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1,
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.neon.blue}40)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          DESIGN<br /><span style={{ WebkitTextFillColor: `${COLORS.white}50` }}>&amp; CODE</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 24, padding: '0 80px', marginTop: 80, width: '100%' }}>
        {services.map((svc, i) => (
          <div key={svc.number} style={{
            flex: 1, padding: '36px 28px', background: `${COLORS.white}04`,
            border: `1px solid ${COLORS.white}08`, borderRadius: 20,
            position: 'relative', overflow: 'hidden',
            ...scaleIn(frame, fps, stagger(i, 10, 6)),
            ...parallaxFloat(frame, 3, 0.015 + i * 0.005),
          }}>
            <div style={{ position: 'absolute', top: -15, right: 8, fontFamily: FONTS.display, fontSize: 160, fontWeight: 900, color: `${COLORS.white}03`, lineHeight: 1 }}>{svc.number}</div>
            <div style={{ position: 'absolute', left: 0, bottom: 0, width: 3, height: frame > stagger(i, 14, 6) ? Math.min(100, (frame - stagger(i, 14, 6)) * 3) : 0, backgroundColor: svc.color, opacity: 0.6, borderRadius: 2 }} />

            <div style={{ width: 48, height: 48, borderRadius: 14, border: `1px solid ${COLORS.white}10`, background: `${COLORS.white}05`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 16, color: svc.color, fontWeight: 700 }}>{svc.number === '01' ? '💻' : svc.number === '02' ? '🎨' : '⚡'}</div>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: `${COLORS.white}25`, letterSpacing: '0.15em', marginBottom: 8 }}>SERVICE_{svc.number}</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 20, fontWeight: 700, color: COLORS.white, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{svc.title}</div>
            <div style={{ fontFamily: FONTS.display, fontSize: 12, color: `${COLORS.white}45`, lineHeight: 1.6, marginBottom: 20 }}>{svc.desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {svc.tags.map((tag, j) => (
                <span key={tag} style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', border: `1px solid ${COLORS.white}10`, color: `${COLORS.white}45`, borderRadius: 6, ...slideUp(frame, fps, stagger(i, 18, 6) + j * 3) }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SceneWrapper>
  );
};
