import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Scroll progress beam: emerald blade with a bright comet head.
 * Head position is percentage-based (resize-safe) and rides the same
 * spring as the blade so they never separate.
 */
const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 28,
        restDelta: 0.001,
    });

    const headLeft = useTransform(progress, (v) => `${v * 100}%`);
    const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

    return (
        <motion.div style={{ opacity }} className="fixed top-0 left-0 right-0 z-[100] h-4 pointer-events-none">
            {/* Soft bloom under the blade */}
            <motion.div
                className="absolute top-0 left-0 h-[6px] w-full bg-gradient-to-r from-emerald-500/0 via-emerald-400/50 to-emerald-300/70 blur-[6px]"
                style={{ scaleX: progress, transformOrigin: "left" }}
                aria-hidden="true"
            />
            {/* Blade core: dark emerald into white-hot tip */}
            <motion.div
                className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-600/40 via-emerald-400 to-white"
                style={{ scaleX: progress, transformOrigin: "left" }}
                aria-hidden="true"
            />
            {/* Comet head: white core in an emerald corona, gentle breath */}
            <motion.div
                className="absolute top-[1px] -translate-x-1/2 -translate-y-1/2"
                style={{ left: headLeft }}
                aria-hidden="true"
            >
                <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_3px_rgba(52,211,153,0.9),0_0_28px_8px_rgba(52,211,153,0.35)]"
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </motion.div>
    );
};

export default ScrollProgress;
