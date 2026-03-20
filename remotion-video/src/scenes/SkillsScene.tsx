import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONTS } from '../styles';
import { slideUp, scaleIn, stagger } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

const skillCategories = [
  { title: 'Languages', skills: [{ name: 'Java', level: 95 }, { name: 'Python', level: 75 }], color: COLORS.emerald[400] },
  { title: 'Frameworks', skills: [{ name: 'Spring Boot', level: 95 }, { name: 'gRPC', level: 80 }, { name: 'ReactJS', level: 70 }], color: COLORS.blue[400] },
  { title: 'Databases', skills: [{ name: 'PostgreSQL', level: 90 }, { name: 'MySQL', level: 85 }, { name: 'Redis', level: 75 }], color: COLORS.purple[400] },
  { title: 'Messaging', skills: [{ name: 'Kafka', level: 90 }, { name: 'NATS', level: 80 }], color: COLORS.amber[400] },
  { title: 'AWS Cloud', skills: [{ name: 'EC2', level: 85 }, { name: 'S3', level: 90 }, { name: 'RDS', level: 85 }], color: COLORS.cyan[400] },
  { title: 'DevOps', skills: [{ name: 'Git', level: 95 }, { name: 'Docker', level: 80 }, { name: 'ELK Stack', level: 85 }], color: COLORS.rose[400] },
];

const ArcRing: React.FC<{ level: number; color: string; frame: number; delay: number; size?: number }> = ({ level, color, frame, delay, size = 44 }) => {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const f = Math.max(0, frame - delay);
  const progress = interpolate(f, [0, 30], [0, level / 100], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const offset = circ - progress * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`${COLORS.white}06`} strokeWidth={3} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} opacity={0.8} style={{ filter: `drop-shadow(0 0 4px ${color}40)` }} />
    </svg>
  );
};

export const SkillsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneWrapper accentColor={COLORS.neon.purple}>
      <div style={{ position: 'absolute', top: 60, left: 80, ...slideUp(frame, fps, 0) }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.2em', color: `${COLORS.white}50`, textTransform: 'uppercase', padding: '6px 16px', border: `1px solid ${COLORS.white}15`, background: `${COLORS.white}08` }}>
          [ SYSTEM_DIAGNOSTICS ]
        </span>
      </div>

      <div style={{ position: 'absolute', top: 120, left: 80, ...slideUp(frame, fps, 3) }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1,
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.neon.purple}30)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          OPERATIONAL<br /><span style={{ WebkitTextFillColor: `${COLORS.white}50` }}>CAPABILITIES</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, padding: '0 80px', marginTop: 100, width: '100%' }}>
        {skillCategories.map((cat, i) => (
          <div key={cat.title} style={{ padding: '24px 20px', background: `${COLORS.white}03`, border: `1px solid ${COLORS.white}06`, borderRadius: 16, ...scaleIn(frame, fps, stagger(i, 10, 5)) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.color, boxShadow: `0 0 10px ${cat.color}60, 0 0 20px ${cat.color}20` }} />
              <span style={{ fontFamily: FONTS.display, fontSize: 14, fontWeight: 700, color: COLORS.white, letterSpacing: '0.02em' }}>{cat.title}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: `${COLORS.white}25`, marginLeft: 'auto', letterSpacing: '0.1em' }}>MODULE_0{i + 1}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cat.skills.map((skill, j) => {
                const d = stagger(i, 15, 5) + j * 4;
                return (
                  <div key={skill.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px', background: `${COLORS.white}02`, borderRadius: 10, border: `1px solid ${COLORS.white}04`, ...slideUp(frame, fps, d) }}>
                    <ArcRing level={skill.level} color={cat.color} frame={frame} delay={d} size={36} />
                    <span style={{ fontFamily: FONTS.mono, fontSize: 11, fontWeight: 600, color: `${COLORS.white}60`, letterSpacing: '0.05em' }}>{skill.name}</span>
                    <span style={{ fontFamily: FONTS.mono, fontSize: 9, color: `${COLORS.white}30`, marginLeft: 'auto' }}>
                      {Math.round(interpolate(Math.max(0, frame - d), [0, 30], [0, skill.level], { extrapolateRight: 'clamp' }))}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </SceneWrapper>
  );
};
