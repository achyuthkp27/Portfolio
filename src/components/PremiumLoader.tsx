import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";

const words = ["Developer", "Designer", "Creator", "Engineer", "Innovator", "Problem Solver"];

const PremiumLoader = () => {
    const { isLoading, setIsLoading } = useLoading();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const wordDuration = 400; // Increased from 300ms for better readability

        if (index === words.length - 1) {
            // End loader after the last word
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timeout);
        }

        const timeout = setTimeout(() => {
            setIndex((prev) => prev + 1);
        }, wordDuration);

        return () => clearTimeout(timeout);
    }, [index]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background"
                >
                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={index}
                                initial={index === 0 ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 20, filter: "blur(10px)" }}
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
