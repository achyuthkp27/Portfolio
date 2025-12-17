import { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion";

interface SpotlightCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

const SpotlightCard = ({
    children,
    className = "",
    spotlightColor = "rgba(255, 255, 255, 0.1)",
    ...props
}: SpotlightCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        const xPos = e.clientX - rect.left;
        const yPos = e.clientY - rect.top;

        setPosition({ x: xPos, y: yPos });

        // Calculate normalized position (-0.5 to 0.5)
        const width = rect.width;
        const height = rect.height;

        const normalizedX = (xPos / width) - 0.5;
        const normalizedY = (yPos / height) - 0.5;

        // Disable tilt on mobile (simple check)
        if (window.matchMedia("(min-width: 768px)").matches) {
            x.set(normalizedX);
            y.set(normalizedY);
        }
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    }

    const handleMouseLeave = () => {
        setOpacity(0);
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1000
            }}
            className={`relative overflow-hidden rounded-xl border border-border/10 bg-card/80 ${className}`}
            {...props}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 md:block hidden"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                    zIndex: 10
                }}
            />
            <div className="relative h-full" style={{ transform: "translateZ(20px)" }}>{children}</div>
        </motion.div>
    );
};

export default SpotlightCard;
