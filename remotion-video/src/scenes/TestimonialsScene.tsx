import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';
import { COLORS, FONTS } from '../styles';
import { slideUp, stagger, parallaxFloat } from '../animations';
import { SceneWrapper } from '../components/SceneWrapper';

const testimonials = [
  { name: 'Rajesh Kumar', role: 'Vice President, FIS Global', quote: 'Achyuth consistently delivers beyond expectations. His microservices expertise has been invaluable to our banking platform.', color: COLORS.emerald[400] },
  { name: 'Ramya S.', role: 'Product Manager, FIS Global', quote: 'A rare combination of technical excellence and creative vision. Every project he touches becomes significantly better.', color: COLORS.blue[400] },
  { name: 'Pradeep K.', role: 'Head of Engineering', quote: 'An exceptional engineer — proactive, reliable, and always pushing for the best possible solution.', color: COLORS.purple[400] },
];

export const TestimonialsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Cycle through testimonials
  const framesPerTestimonial = Math.floor(durationInFrames / testimonials.length);
  const activeIndex = Math.min(testimonials.length - 1, Math.floor(frame / framesPerTestimonial));

  return (
    <SceneWrapper accentColor={COLORS.neon.purple}>
      <div style={{ position: 'absolute', top: 60, left: 80, ...slideUp(frame, fps, 0) }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: '0.2em', color: `${COLORS.white}50`, textTransform: 'uppercase', padding: '6px 16px', border: `1px solid ${COLORS.white}15`, background: `${COLORS.white}08` }}>
          [ CLIENT_FEEDBACK ]
        </span>
      </div>

      <div style={{ position: 'absolute', top: 140, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          fontFamily: FONTS.display, fontSize: 64, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, textAlign: 'center',
          background: `linear-gradient(135deg, ${COLORS.white}, ${COLORS.neon.purple}30)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          ...slideUp(frame, fps, 3),
        }}>
          WHAT THEY <span style={{ WebkitTextFillColor: `${COLORS.white}50` }}>SAY</span>
        </div>
      </div>

      {/* Centered testimonial card — cycles through */}
      <div style={{ position: 'absolute', top: '50%', left: 200, right: 200, transform: 'translateY(-20%)' }}>
        {testimonials.map((t, i) => {
          const start = i * framesPerTestimonial;
          const end = start + framesPerTestimonial;
          const localFrame = frame - start;
          if (frame < start || frame >= end) return null;

          const entryOpacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
          const exitOpacity = interpolate(localFrame, [framesPerTestimonial - 12, framesPerTestimonial], [1, 0], { extrapolateRight: 'clamp' });
          const entryY = interpolate(localFrame, [0, 15], [40, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });

          return (
            <div key={i} style={{
              opacity: entryOpacity * exitOpacity, transform: `translateY(${entryY}px)`,
              padding: '56px 64px', background: `${COLORS.white}04`,
              border: `1px solid ${COLORS.white}10`, borderRadius: 28,
              borderLeft: `4px solid ${t.color}40`, textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Quote mark */}
              <div style={{ position: 'absolute', top: 12, left: 36, fontFamily: FONTS.display, fontSize: 140, fontWeight: 900, color: `${COLORS.white}04`, lineHeight: 1 }}>"</div>

              <div style={{ fontFamily: FONTS.display, fontSize: 22, color: `${COLORS.white}75`, lineHeight: 1.8, maxWidth: 800, margin: '0 auto 36px', fontStyle: 'italic', position: 'relative', zIndex: 10 }}>
                "{t.quote}"
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: t.color, boxShadow: `0 0 12px ${t.color}60` }} />
                <div>
                  <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 700, color: COLORS.white }}>{t.name}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: `${COLORS.white}40`, letterSpacing: '0.1em' }}>{t.role}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div style={{ position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10 }}>
        {testimonials.map((_, i) => (
          <div key={i} style={{ width: i === activeIndex ? 24 : 6, height: 6, borderRadius: 3, backgroundColor: i === activeIndex ? COLORS.white : `${COLORS.white}20` }} />
        ))}
      </div>
    </SceneWrapper>
  );
};
