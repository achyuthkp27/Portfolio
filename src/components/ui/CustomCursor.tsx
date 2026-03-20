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
    const [cursorVariant, setCursorVariant] = useState("default");
    const [magneticTarget, setMagneticTarget] = useState<DOMRect | null>(null);
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

        // Mouse hover scanning 
        const scanInteractions = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const cursorElem = target.closest('[data-cursor]');

            if (cursorElem) {
                const type = cursorElem.getAttribute('data-cursor') || 'hover';
                setCursorVariant(type);

                if (type === 'magnetic') {
                    const rect = cursorElem.getBoundingClientRect();
                    setMagneticTarget(rect);

                    // Apply magnetic parallax pull
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const distanceX = e.clientX - centerX;
                    const distanceY = e.clientY - centerY;
                    
                    cursorX.set(centerX + distanceX * 0.2);
                    cursorY.set(centerY + distanceY * 0.2);
                    return;
                }
                setMagneticTarget(null);
            } else {
                const isInteractive = target.closest("a, button, [role='button'], input, textarea, select");
                setCursorVariant(isInteractive ? "hover" : "default");
                setMagneticTarget(null);
            }

            // Normal tracking
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const onMouseDown = (e: MouseEvent) => {
            setIsClicked(true);
            setShockwaves(prev => [...prev, { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }]);
        };
        const onMouseUp = () => setIsClicked(false);

        // Scan cursor state on mouse move
        window.addEventListener("mousemove", scanInteractions);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("resize", checkMobile);
            window.removeEventListener("mousemove", scanInteractions);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [cursorX, cursorY]);

    if (isMobile) return null;

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">
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
                    width: cursorVariant === 'default' ? 8 : 0, // Hide dot completely on hover contexts
                    height: cursorVariant === 'default' ? 8 : 0,
                }}
            />

            {/* Fluid Follower Ring */}
            <motion.div
                className="fixed top-0 left-0 border border-primary/50 flex items-center justify-center pointer-events-none mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: cursorVariant === "magnetic" && magneticTarget ? magneticTarget.width + 16 : 
                           cursorVariant === "view" ? 80 : 
                           cursorVariant === "hover" ? 60 : 24,
                    height: cursorVariant === "magnetic" && magneticTarget ? magneticTarget.height + 16 : 
                            cursorVariant === "view" ? 80 : 
                            cursorVariant === "hover" ? 60 : 24,
                    opacity: cursorVariant === "default" ? 0.5 : 1,
                    backgroundColor: cursorVariant === "view" ? "hsl(var(--primary))" : 
                                     cursorVariant !== "default" ? "hsl(var(--primary) / 0.1)" : "hsl(var(--primary) / 0)",
                    borderRadius: cursorVariant === "magnetic" ? "12px" : "50%",
                    scale: isClicked ? 0.9 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 28,
                    mass: 0.5
                }}
            >
                {/* View Text Overlay */}
                <AnimatePresence>
                    {cursorVariant === "view" && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="text-[10px] font-bold text-black mix-blend-normal tracking-widest"
                        >
                            VIEW
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default CustomCursor;
