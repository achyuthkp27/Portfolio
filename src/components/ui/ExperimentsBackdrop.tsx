import { useCallback, useRef, useState } from "react";
import { motion, useInView, useReducedMotionConfig, useScroll, useTransform } from "framer-motion";
import { phase } from "@/lib/phase";
import { ParticleOrb } from "./ParticleOrb";

/**
 * The ground behind Experiments: an emerald orb on the page's own grid, held on screen while
 * the section scrolls past. The orb is a turning globe of points that blasts apart as you
 * scroll down the list, like the hero photo comes apart, and gathers again on the way back. Without WebGL, or under reduced motion, it is the plain glass orb.
 */
export const ExperimentsBackdrop = () => {
  const ref = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotionConfig();
  const onScreen = useInView(ref);
  const [particles, setParticles] = useState(true);
  const fallBack = useCallback(() => setParticles(false), []);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(p, (v) => (reduceMotion ? 0 : (v - 0.5) * -140));
  const rotate = useTransform(p, (v) => (reduceMotion ? 0 : v * 160));
  const scatter = useTransform(p, (v) => phase(v, 0.35, 0.75));
  const live = particles && !reduceMotion;

  return (
    // overflow: clip, not hidden, so the sticky layer inside still pins to the screen
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 pointer-events-none overflow-clip">
      <div className="sticky top-0 h-screen">
        <div className="absolute right-[4%] md:right-[8%] top-1/2 -translate-y-1/2 w-[min(52vmin,480px)] aspect-square">
          <motion.div ref={orb} style={{ y }} className="absolute inset-0">
            <div className="absolute -inset-[35%] rounded-full bg-[radial-gradient(circle,hsl(var(--accent-500)/0.12),transparent_62%)]" />
            {!live && (
              <motion.div
                style={{ rotate }}
                className="absolute inset-0 rounded-full border border-emerald-400/25 bg-[radial-gradient(circle_at_32%_28%,hsl(var(--accent-400)/0.34),hsl(var(--accent-500)/0.08)_45%,transparent_72%)] shadow-[inset_0_0_60px_hsl(var(--accent-400)/0.12)]"
              />
            )}
          </motion.div>
        </div>
        {live && <ParticleOrb anchor={orb} scatter={scatter} running={onScreen} onFailure={fallBack} />}
      </div>
    </div>
  );
};

export default ExperimentsBackdrop;
