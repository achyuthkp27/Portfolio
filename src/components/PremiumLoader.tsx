import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const words = ["Developer", "Designer", "Creator", "Engineer", "Innovator", "Problem Solver"];

const PremiumLoader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Cycle through words
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 400);

        // Stop loading after 2.5s
        const timeout = setTimeout(() => {
            setIsLoading(false);
            clearInterval(interval);
        }, 2200);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background"
                >
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={index}
                                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                                transition={{ duration: 0.2 }}
                                className="text-4xl md:text-6xl font-display font-bold text-gradient tracking-tight"
                            >
                                {words[index]}
                            </motion.h1>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PremiumLoader;
