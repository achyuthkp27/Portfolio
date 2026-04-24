import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import { useProgress } from "@react-three/drei";
import { useMobile } from "@/hooks/useMobile";

const words = ["Developer", "Designer", "Creator", "Engineer", "Innovator", "Problem Solver"];

const PremiumLoader = () => {
    const { isLoading, setIsLoading } = useLoading();
    const [index, setIndex] = useState(0);
    const { progress } = useProgress();
    const isMobile = useMobile();

    // Word Flip Animation Sequence
    useEffect(() => {
        const wordDuration = 400; 

        if (index < words.length - 1) {
            const timeout = setTimeout(() => {
                setIndex((prev) => prev + 1);
            }, wordDuration);
            return () => clearTimeout(timeout);
        }
    }, [index]);

    // Wait for BOTH words to finish AND 3D assets to load
    useEffect(() => {
        // Ensure the full word sequence plays, and 3D assets are loaded (or if progress sits at 0 because it loaded instantly)
        if (index === words.length - 1 && (progress === 100 || progress === 0)) {
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 800);
            return () => clearTimeout(timeout);
        }
    }, [index, progress, setIsLoading]);

    // Graphically smooth the terminal progress bar so it rapidly ticks up instead of jumping
    const [displayProgress, setDisplayProgress] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayProgress((prev) => {
                const isDone = index === words.length - 1 && (progress === 100 || progress === 0);
                // The target is either actual R3F progress, or a simulated minimum so the bar feels alive
                const target = isDone ? 100 : Math.max(progress, Math.min(96, (index / words.length) * 100 + 15));
                
                if (prev < target) {
                    const step = Math.max(1, (target - prev) * 0.15);
                    return Math.min(100, prev + step);
                }
                return prev;
            });
        }, 50); // Reduced frequency to 50ms to free up CPU on low-end devices
        return () => clearInterval(interval);
    }, [progress, index]);

    // Safety fallback: Force unlock after 6 seconds in case 3D hangs
    useEffect(() => {
        const fallback = setTimeout(() => {
            setIsLoading(false);
        }, 6000);
        return () => clearTimeout(fallback);
    }, [setIsLoading]);

    const renderProgressBar = () => {
        const totalBars = 20;
        const p = Math.round(displayProgress);
        const filledBars = Math.round((p / 100) * totalBars);
        const emptyBars = Math.max(0, totalBars - filledBars);
        return `[${'#'.repeat(filledBars)}${' '.repeat(emptyBars)}] ${p}%`;
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
                >
                    <div className="relative flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={index}
                                initial={index === 0 
                                    ? { opacity: 1, y: 0, filter: isMobile ? undefined : "blur(0px)" } 
                                    : { opacity: 0, y: 20, filter: isMobile ? undefined : "blur(10px)" }
                                }
                                animate={{ opacity: 1, y: 0, filter: isMobile ? undefined : "blur(0px)" }}
                                exit={{ opacity: 0, y: -20, filter: isMobile ? undefined : "blur(10px)" }}
                                transition={{ duration: 0.2 }}
                                className="text-4xl md:text-6xl font-display font-bold text-gradient tracking-tight text-center"
                            >
                                {words[index]}
                            </motion.h1>
                        </AnimatePresence>

                        {/* Absolutely position the terminal loader so it doesn't push the text up */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute top-[100%] pt-12 left-1/2 -translate-x-1/2 font-mono text-emerald-500/80 text-sm tracking-widest whitespace-nowrap text-center"
                        >
                            <div className="mb-2 text-xs opacity-50">INITIALIZING_3D_ENGINE...</div>
                            <div className="whitespace-pre">{renderProgressBar()}</div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PremiumLoader;
