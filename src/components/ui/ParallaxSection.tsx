import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

interface ParallaxSectionProps {
    children: ReactNode;
    offset?: number;
    className?: string;
    speed?: number; // Speed multiplier (e.g., 0.5 for half speed, 2 for double speed)
}

const ParallaxSection = ({
    children,
    offset = 50,
    className = "",
    speed = 0.5
}: ParallaxSectionProps) => {
    const ref = useRef<HTMLDivElement>(null);

    // Track scroll progress relative to this specific element
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Calculate parallax movement based on speed
    // Default: moves opposite to scroll direction for depth effect
    const yRange = useTransform(scrollYProgress, [0, 1], [offset * speed, -offset * speed]);

    // Add smooth spring physics for buttery scrolling feel
    const y = useSpring(yRange, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={ref} className={`relative ${className}`}>
            <motion.div style={{ y }} className="h-full">
                {children}
            </motion.div>
        </div>
    );
};

export default ParallaxSection;
