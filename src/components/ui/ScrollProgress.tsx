import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/** A single hairline of progress along the top edge, in the accent. */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

  return (
    <motion.div
      style={{ opacity, scaleX: progress, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-emerald-400 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ScrollProgress;
