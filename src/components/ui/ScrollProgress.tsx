import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const x = useTransform(scrollYProgress, (v) => v * (typeof window !== 'undefined' ? window.innerWidth : 0));
    const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-4 pointer-events-none">
            {/* The Main Progress Bar (Beam) */}
            <motion.div
                className="absolute top-0 left-0 bottom-0 bg-white shadow-[0_0_10px_white]"
                style={{
                    scaleX,
                    transformOrigin: "left",
                    height: '2px',
                }}
            />

            {/* The Comet Head (Glowing Tip) */}
            <motion.div
                className="absolute top-0 h-1 w-4 bg-white rounded-full shadow-[0_0_15px_2px_rgba(255,255,255,0.8)] blur-[1px]"
                style={{
                    left: 0,
                    x,
                    top: '-1px',
                    opacity
                }}
            />
        </div>
    );
};

export default ScrollProgress;
