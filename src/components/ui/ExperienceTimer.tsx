import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ExperienceTimerProps {
    startDate: Date;
}

const ExperienceTimer = ({ startDate }: ExperienceTimerProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [ticker, setTicker] = useState(0);

    // Force re-render every second only when hovered
    useEffect(() => {
        if (!isHovered) return;
        const interval = setInterval(() => {
            setTicker((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [isHovered]);

    const calculateDuration = () => {
        const now = new Date();
        const diff = now.getTime() - startDate.getTime();

        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        const remainingAfterYears = diff % (1000 * 60 * 60 * 24 * 365.25);
        const months = Math.floor(remainingAfterYears / (1000 * 60 * 60 * 24 * 30.44));
        const remainingAfterMonths = remainingAfterYears % (1000 * 60 * 60 * 24 * 30.44);
        const days = Math.floor(remainingAfterMonths / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { years, months, days, hours, minutes, seconds };
    };

    const { years, months, days, hours, minutes, seconds } = calculateDuration();

    return (
        <div
            className="relative flex flex-col items-center justify-center w-full h-full cursor-pointer z-50 pointer-events-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <AnimatePresence mode="wait">
                {!isHovered ? (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="flex flex-col items-center"
                    >
                        <span className="block text-8xl font-display font-bold text-white mb-2 tracking-tighter drop-shadow-2xl">
                            {years}+
                        </span>
                        <span className="text-sm font-mono uppercase tracking-[0.2em] text-white/50 border-t border-white/10 pt-4">
                            Years Experience
                        </span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="detailed"
                        initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="flex flex-col items-center justify-center w-full"
                    >
                        {/* Cybernetic Container */}
                        <div className="relative p-6 border border-emerald-500/30 bg-black/80 backdrop-blur-xl rounded-sm">
                            {/* Decorative corners */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-500" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500" />

                            <div className="grid grid-cols-3 gap-x-8 gap-y-6 text-center">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-mono font-bold text-white/90">{years}</span>
                                    <span className="text-[10px] uppercase text-emerald-500/70 tracking-widest">YRS</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-mono font-bold text-white/90">{months}</span>
                                    <span className="text-[10px] uppercase text-emerald-500/70 tracking-widest">MOS</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-mono font-bold text-white/90">{days}</span>
                                    <span className="text-[10px] uppercase text-emerald-500/70 tracking-widest">DAYS</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-mono font-bold text-white/90">{hours}</span>
                                    <span className="text-[10px] uppercase text-emerald-500/70 tracking-widest">HRS</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-mono font-bold text-white/90">{minutes}</span>
                                    <span className="text-[10px] uppercase text-emerald-500/70 tracking-widest">MIN</span>
                                </div>
                                <div className="flex flex-col">
                                    <div className="relative">
                                        <span className="text-3xl font-mono font-bold text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                                            {seconds.toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span className="text-[10px] uppercase text-emerald-500/70 tracking-widest">SEC</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-2 border-t border-white/10 text-center">
                                <span className="text-[8px] font-mono text-white/30 tracking-[0.3em] uppercase animate-pulse">
                                    LIVE_SYSTEM_UPTIME
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExperienceTimer;
