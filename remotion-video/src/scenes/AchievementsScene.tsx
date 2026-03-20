import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONTS } from '../styles';
import { slideUp, slideRight, scaleIn } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

export const AchievementsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Light sweep — a bright diagonal line crossing the award card
  const sweepPos = interpolate(frame, [15, 80], [-20, 120], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  // Slow zoom for prestige feel
  const slowZoom = interpolate(frame, [0, durationInFrames], [1, 1.03], {
    extrapolateRight: 'clamp',
  });

  return (
    <SceneWrapper accentColor={COLORS.amber[400]}>
      <div style={{ position: 'absolute', top: 60, left: 80, ...slideUp(frame, fps, 0) }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.2em', color: `${COLORS.white}50`, textTransform: 'uppercase', padding: '6px 16px', border: `1px solid ${COLORS.white}15`, background: `${COLORS.white}08` }}>
          [ RECOGNITION_LOG ]
        </span>
      </div>

      <div style={{ position: 'absolute', top: 110, left: 80, ...slideUp(frame, fps, 3) }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1,
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.amber[400]}40)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          HONORS &<br /><span style={{ WebkitTextFillColor: `${COLORS.white}50` }}>AWARDS</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 230, left: 80, right: 80, bottom: 80, display: 'flex', gap: 40, transform: `scale(${slowZoom})` }}>
        {/* Award Card */}
        <div style={{
          flex: 2, padding: '48px 56px', background: `${COLORS.white}03`,
          border: `1px solid ${COLORS.white}08`, borderRadius: 24,
          position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          ...scaleIn(frame, fps, 6),
        }}>
          {/* Light sweep — diagonal shine across card */}
          <div style={{
            position: 'absolute', top: '-50%', left: `${sweepPos}%`,
            width: '6%', height: '200%',
            background: `linear-gradient(90deg, transparent, ${COLORS.amber[400]}08, ${COLORS.white}06, ${COLORS.amber[400]}08, transparent)`,
            transform: 'rotate(15deg)', filter: 'blur(20px)',
            pointerEvents: 'none', zIndex: 5,
          }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 24, borderTop: `2px solid ${COLORS.amber[500]}30`, borderLeft: `2px solid ${COLORS.amber[500]}30` }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderTop: `2px solid ${COLORS.amber[500]}30`, borderRight: `2px solid ${COLORS.amber[500]}30` }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 24, height: 24, borderBottom: `2px solid ${COLORS.amber[500]}30`, borderLeft: `2px solid ${COLORS.amber[500]}30` }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderBottom: `2px solid ${COLORS.amber[500]}30`, borderRight: `2px solid ${COLORS.amber[500]}30` }} />
          <div style={{ position: 'absolute', inset: -60, background: `radial-gradient(circle at center, ${COLORS.amber[500]}08, transparent 60%)` }} />

          {/* Trophy badge */}
          <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, zIndex: 10, ...scaleIn(frame, fps, 10) }}>
            <div style={{ position: 'absolute', inset: 0, border: `1px solid ${COLORS.amber[500]}25`, borderRadius: '50%', transform: `rotate(${frame * 1.2}deg)` }} />
            <div style={{ position: 'absolute', inset: 6, border: `1px dashed ${COLORS.amber[500]}15`, borderRadius: '50%', transform: `rotate(${-frame * 0.8}deg)` }} />
            <div style={{ width: 80, height: 80, borderRadius: '50%', border: `1px solid ${COLORS.amber[500]}35`, background: `${COLORS.bg}cc`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${COLORS.amber[500]}15, 0 0 60px ${COLORS.amber[500]}08` }}>
              <span style={{ fontSize: 36 }}>🏆</span>
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', border: `1px solid ${COLORS.amber[500]}20`, background: `${COLORS.amber[500]}05`, borderRadius: 6, marginBottom: 20, zIndex: 10, ...slideUp(frame, fps, 16) }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.amber[500], boxShadow: `0 0 6px ${COLORS.amber[500]}` }} />
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.15em', color: `${COLORS.amber[500]}cc`, textTransform: 'uppercase' }}>Q1 2024 // FIS GLOBAL</span>
          </div>

          <div style={{
            fontFamily: FONTS.display, fontSize: 38, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.2,
            background: `linear-gradient(90deg, ${COLORS.white}, ${COLORS.amber[400]}cc, ${COLORS.white})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 24, zIndex: 10, ...slideUp(frame, fps, 20),
          }}>
            Above and Beyond<br />Individual Award
          </div>

          <div style={{ width: 120, height: 1, margin: '0 auto 20px', background: `linear-gradient(90deg, transparent, ${COLORS.amber[500]}50, transparent)`, boxShadow: `0 0 10px ${COLORS.amber[500]}20`, ...slideUp(frame, fps, 25) }} />

          <div style={{ fontFamily: FONTS.display, fontSize: 14, color: `${COLORS.white}55`, lineHeight: 1.7, maxWidth: 600, zIndex: 10, ...slideUp(frame, fps, 28) }}>
            Recognized for exceptional contributions to the banking microservices platform, demonstrating technical excellence, proactive problem-solving, and leadership in delivering high-impact solutions.
          </div>
        </div>

        {/* Education Card */}
        <div style={{
          flex: 1, padding: '36px 28px', background: `${COLORS.white}03`,
          border: `1px solid ${COLORS.white}08`, borderRadius: 24,
          borderLeft: `3px solid ${COLORS.blue[400]}30`,
          display: 'flex', flexDirection: 'column',
          ...slideRight(frame, fps, 14),
        }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.blue[400], letterSpacing: '0.2em', marginBottom: 16, textTransform: 'uppercase', textShadow: `0 0 15px ${COLORS.blue[400]}30` }}>ACADEMIC_LOG</div>
          <div style={{ fontFamily: FONTS.display, fontSize: 28, fontWeight: 800, color: COLORS.white, marginBottom: 8, lineHeight: 1.2 }}>Bachelor of Engineering</div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: `${COLORS.blue[400]}80`, marginBottom: 20, letterSpacing: '0.06em' }}>{'>'} Computer Science & Engineering</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, padding: '6px 14px', border: `1px solid ${COLORS.white}10`, color: `${COLORS.white}50`, borderRadius: 8, background: `${COLORS.white}05`, letterSpacing: '0.1em' }}>📍 S.S.I.T., Tumkur, India</span>
            <span style={{ fontFamily: FONTS.mono, fontSize: 10, padding: '6px 14px', border: `1px solid ${COLORS.white}10`, color: `${COLORS.white}50`, borderRadius: 8, background: `${COLORS.white}05`, letterSpacing: '0.1em' }}>📅 2017 – 2021</span>
          </div>
          <div style={{ fontFamily: FONTS.display, fontSize: 12, color: `${COLORS.white}40`, lineHeight: 1.7, borderTop: `1px solid ${COLORS.white}08`, paddingTop: 16, marginTop: 'auto' }}>
            Advanced study in distributed systems, database management, and software engineering principles.
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
};
