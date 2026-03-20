import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONTS } from '../styles';
import { slideUp } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

const projects = [
  { title: 'Banking API Platform', desc: '25+ microservices powering corporate & retail banking', tags: ['Spring Boot', 'Kafka', 'AWS'], stat: '3x', statLabel: 'THROUGHPUT', statNum: 300, color: COLORS.emerald[400] },
  { title: 'Centralized Logging', desc: 'ELK Stack + Kafka for enterprise-wide observability', tags: ['ELK Stack', 'Docker', 'Kafka'], stat: '25%', statLabel: 'FASTER DEBUG', statNum: 25, color: COLORS.blue[400] },
  { title: 'Notification Engine', desc: 'Event-driven system handling millions of messages daily', tags: ['Kafka', 'Redis', 'Spring Boot'], stat: '10x', statLabel: 'THROUGHPUT', statNum: 100, color: COLORS.purple[400] },
  { title: 'Secure File Storage', desc: 'MinIO-based S3-compatible storage with IAM policies', tags: ['MinIO', 'AWS S3', 'IAM'], stat: '50%', statLabel: 'COST REDUCTION', statNum: 50, color: COLORS.amber[400] },
  { title: 'Monitoring Dashboard', desc: 'Real-time microservice health & performance metrics', tags: ['ReactJS', 'WebSocket', 'ELK'], stat: '60%', statLabel: 'FASTER MTTR', statNum: 60, color: COLORS.cyan[400] },
];

/**
 * PROJECTS — Hero scene with animated graph bars and slide-in cards
 */
export const ProjectsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const framesPerProject = Math.floor(durationInFrames / projects.length);
  const projectIndex = Math.min(projects.length - 1, Math.floor(frame / framesPerProject));

  return (
    <SceneWrapper accentColor={COLORS.neon.blue}>
      <div style={{ position: 'absolute', top: 60, left: 80, ...slideUp(frame, fps, 0) }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.2em', color: `${COLORS.white}50`, textTransform: 'uppercase', padding: '6px 16px', border: `1px solid ${COLORS.white}15`, background: `${COLORS.white}08` }}>
          [ PROJECT_ARCHIVE ]
        </span>
      </div>

      <div style={{ position: 'absolute', top: 140, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, textAlign: 'center',
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.neon.blue}30)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          ...slideUp(frame, fps, 3),
        }}>
          FEATURED <span style={{ WebkitTextFillColor: `${COLORS.white}50` }}>PROJECTS</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 120, right: 100, fontFamily: FONTS.mono, fontSize: 60, fontWeight: 800, color: `${COLORS.white}06` }}>0{projectIndex + 1}/05</div>

      {/* Project cards — vertically centered */}
      <div style={{ position: 'absolute', top: '50%', left: 80, right: 80, transform: 'translateY(-30%)' }}>
        {projects.map((proj, i) => {
          const start = i * framesPerProject;
          const end = start + framesPerProject;
          const localFrame = frame - start;
          if (frame < start || frame >= end) return null;

          // Alternate slide direction per spec
          const slideDir = i % 2 === 0 ? -1 : 1;
          const entryOpacity = interpolate(localFrame, [0, 14], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
          const exitOpacity = interpolate(localFrame, [framesPerProject - 15, framesPerProject], [1, 0], { extrapolateRight: 'clamp' });
          const entryX = interpolate(localFrame, [0, 18], [80 * slideDir, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
          const entryScale = interpolate(localFrame, [0, 18], [0.92, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
          
          // Zoom punch at exit per spec
          const exitScale = interpolate(localFrame, [framesPerProject - 10, framesPerProject], [1, 1.05], { extrapolateRight: 'clamp' });

          const detailOpacity = interpolate(localFrame, [18, 28], [0, 1], { extrapolateRight: 'clamp' });

          // Graph bar animation
          const barWidth = interpolate(localFrame, [20, 50], [0, proj.statNum], {
            extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
          });

          return (
            <div key={i} style={{
              opacity: entryOpacity * exitOpacity,
              transform: `translateX(${entryX}px) scale(${entryScale * exitScale})`,
              display: 'flex', gap: 40, alignItems: 'center',
              padding: '44px 52px', background: `${COLORS.white}04`,
              border: `1px solid ${COLORS.white}10`, borderRadius: 24,
              borderLeft: `4px solid ${proj.color}50`, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -20, right: 30, fontFamily: FONTS.display, fontSize: 200, fontWeight: 900, color: `${COLORS.white}03`, lineHeight: 1 }}>0{i + 1}</div>

              <div style={{ flex: 1, zIndex: 10 }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: proj.color, letterSpacing: '0.15em', marginBottom: 10, textShadow: `0 0 15px ${proj.color}40` }}>PROJECT_0{i + 1}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 36, fontWeight: 800, color: COLORS.white, marginBottom: 12, letterSpacing: '-0.01em' }}>{proj.title}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: 15, color: `${COLORS.white}55`, lineHeight: 1.6, marginBottom: 16, maxWidth: 550, opacity: detailOpacity }}>{proj.desc}</div>

                {/* Dynamic graph bar — grows to represent metric */}
                <div style={{ marginBottom: 16, opacity: detailOpacity }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: `${COLORS.white}35`, letterSpacing: '0.1em' }}>IMPACT</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: proj.color, fontWeight: 700 }}>{proj.stat}</div>
                  </div>
                  <div style={{ width: '100%', height: 4, background: `${COLORS.white}08`, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      width: `${barWidth}%`, height: '100%', borderRadius: 2,
                      background: `linear-gradient(90deg, ${proj.color}60, ${proj.color})`,
                      boxShadow: `0 0 10px ${proj.color}30`,
                    }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  {proj.tags.map((tag, j) => (
                    <span key={tag} style={{
                      fontFamily: FONTS.mono, fontSize: 10, padding: '5px 12px',
                      border: `1px solid ${COLORS.white}12`, color: `${COLORS.white}50`,
                      borderRadius: 8, letterSpacing: '0.1em', textTransform: 'uppercase',
                      opacity: interpolate(localFrame, [25 + j * 4, 33 + j * 4], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Stat badge */}
              <div style={{
                padding: '32px 48px', background: `${proj.color}08`,
                border: `1px solid ${proj.color}20`, borderRadius: 20,
                textAlign: 'center', minWidth: 200, opacity: detailOpacity, zIndex: 10,
                boxShadow: `0 0 30px ${proj.color}08`,
              }}>
                <div style={{ fontFamily: FONTS.display, fontSize: 42, fontWeight: 800, color: proj.color, marginBottom: 8, textShadow: `0 0 20px ${proj.color}30` }}>{proj.stat}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: `${COLORS.white}40`, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{proj.statLabel}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
        {projects.map((_, i) => (
          <div key={i} style={{ width: i === projectIndex ? 28 : 6, height: 6, borderRadius: 3, backgroundColor: i === projectIndex ? COLORS.white : `${COLORS.white}20` }} />
        ))}
      </div>
    </SceneWrapper>
  );
};
