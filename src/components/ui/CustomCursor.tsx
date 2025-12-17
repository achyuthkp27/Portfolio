import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

const Shockwave = ({ x, y, onComplete }: { x: number; y: number; onComplete: () => void }) => (
    <motion.div
        initial={{ scale: 0, opacity: 0.8, borderWidth: "4px" }}
        animate={{ scale: 3, opacity: 0, borderWidth: "0px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        onAnimationComplete={onComplete}
        className="fixed pointer-events-none z-[9999] w-12 h-12 rounded-full border border-cyan-500"
        style={{ left: x - 24, top: y - 24 }}
    />
);

const CustomCursor = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);

    // Mouse position values
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring configuration for fluid follower
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Mobile check
        const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        checkMobile();
        window.addEventListener("resize", checkMobile);

        // Mouse move handler
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        // Interaction handlers
        const onMouseDown = (e: MouseEvent) => {
            setIsClicked(true);
            setShockwaves(prev => [...prev, { id: Date.now(), x: e.clientX, y: e.clientY }]);
        };
        const onMouseUp = () => setIsClicked(false);
        const onMouseEnter = () => setIsHovered(true);
        const onMouseLeave = () => setIsHovered(false);

        // Attach listeners
        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        // Add hover effect to clickable elements
        const handleLinkHover = () => {
            const linkElements = document.querySelectorAll("a, button, [role='button'], input, textarea, select");
            linkElements.forEach((el) => {
                el.addEventListener("mouseenter", onMouseEnter);
                el.addEventListener("mouseleave", onMouseLeave);
            });
            return () => {
                linkElements.forEach((el) => {
                    el.removeEventListener("mouseenter", onMouseEnter);
                    el.removeEventListener("mouseleave", onMouseLeave);
                });
            };
        };

        const cleanupLinks = handleLinkHover();

        // Observe DOM mutations to attach listeners to new elements
        const observer = new MutationObserver(handleLinkHover);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("resize", checkMobile);
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            cleanupLinks();
            observer.disconnect();
        };
    }, [cursorX, cursorY]);

    if (isMobile) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-visible">
            {/* Shockwaves */}
            <AnimatePresence>
                {shockwaves.map((wave) => (
                    <Shockwave
                        key={wave.id}
                        x={wave.x}
                        y={wave.y}
                        onComplete={() => {
                            setShockwaves((prev) => prev.filter((w) => w.id !== wave.id));
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Main Dot Cursor */}
            <motion.div
                className="fixed top-0 left-0 bg-primary rounded-full mix-blend-difference"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: isHovered ? 8 : 8,
                    height: isHovered ? 8 : 8,
                }}
            />

            {/* Fluid Follower Ring */}
            <motion.div
                className="fixed top-0 left-0 border border-primary/50 rounded-full mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: isHovered ? 60 : 24,
                    height: isHovered ? 60 : 24,
                    opacity: isHovered ? 1 : 0.5,
                    backgroundColor: isHovered ? "hsl(var(--primary) / 0.1)" : "transparent",
                    scale: isClicked ? 0.8 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                }}
            />
        </div>
    );
};

export default CustomCursor;
