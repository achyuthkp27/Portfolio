import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";
import { useMobile } from "@/hooks/useMobile";

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
    const isMobile = useMobile();
    const isLowEnd = useLowEndDevice();
    const cursorVariantRef = useRef("default");
    const magneticTargetRef = useRef<DOMRect | null>(null);
    const [renderKey, setRenderKey] = useState(0);
    const [isClicked, setIsClicked] = useState(false);
    const [shockwaves, setShockwaves] = useState<{ id: number; x: number; y: number }[]>([]);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const rafIdRef = useRef<number>(0);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const canUseCustomCursor =
            !isMobile &&
            isLowEnd === false &&
            window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!canUseCustomCursor) {
            document.documentElement.classList.remove("custom-cursor-enabled");
            return;
        }

        document.documentElement.classList.add("custom-cursor-enabled");

        const scanInteractions = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);

            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = requestAnimationFrame(() => {
                const target = e.target as HTMLElement;
                const cursorElem = target.closest('[data-cursor]') as HTMLElement | null;
                let newVariant = "default";
                let newMagneticTarget: DOMRect | null = null;

                if (cursorElem) {
                    const type = cursorElem.getAttribute('data-cursor') || 'hover';
                    newVariant = type;

                    if (type === 'magnetic') {
                        const rect = cursorElem.getBoundingClientRect();
                        newMagneticTarget = rect;

                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        const distanceX = e.clientX - centerX;
                        const distanceY = e.clientY - centerY;

                        cursorX.set(centerX + distanceX * 0.2);
                        cursorY.set(centerY + distanceY * 0.2);
                    }
                } else {
                    const isInteractive = target.closest("a, button, [role='button'], input, textarea, select");
                    newVariant = isInteractive ? "hover" : "default";
                }

                const variantChanged = newVariant !== cursorVariantRef.current;
                cursorVariantRef.current = newVariant;
                magneticTargetRef.current = newMagneticTarget;

                if (variantChanged) {
                    setRenderKey((n) => n + 1);
                }
            });
        };

        const onMouseDown = (e: MouseEvent) => {
            setIsClicked(true);
            setShockwaves(prev => {
                const next = [...prev, { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }];
                return next.slice(-3);
            });
        };
        const onMouseUp = () => setIsClicked(false);

        window.addEventListener("mousemove", scanInteractions, { passive: true });
        window.addEventListener("mousedown", onMouseDown, { passive: true });
        window.addEventListener("mouseup", onMouseUp, { passive: true });

        return () => {
            cancelAnimationFrame(rafIdRef.current);
            document.documentElement.classList.remove("custom-cursor-enabled");
            window.removeEventListener("mousemove", scanInteractions);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [cursorX, cursorY, isLowEnd, isMobile]);

    if (isMobile || isLowEnd !== false) return null;

    const cursorVariant = cursorVariantRef.current;
    const magneticTarget = magneticTargetRef.current;

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
                    width: cursorVariant === 'default' ? 8 : 0,
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
