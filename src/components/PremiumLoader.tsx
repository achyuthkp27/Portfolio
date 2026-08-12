import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLoading } from "@/context/LoadingContext";
import { useMobile } from "@/hooks/useMobile";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";

// Word-flip sequence on load, ending on the name
const words = ["Developer", "Engineer", "Creator", "Achyuth KP"];

const PremiumLoader = () => {
    const { isLoading, setIsLoading } = useLoading();
    const [index, setIndex] = useState(0);
    const isMobile = useMobile();
    const isLowEnd = useLowEndDevice();
    const [shouldSkipLoader, setShouldSkipLoader] = useState(false);

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const narrowViewport = window.innerWidth < 768;
        const lowEndDevice = isLowEnd === true;

        if (narrowViewport || reduceMotion || lowEndDevice || isMobile) {
            setShouldSkipLoader(true);
            setIsLoading(false);
        }
    }, [isLowEnd, isMobile, setIsLoading]);

    // Word Flip Animation Sequence
    useEffect(() => {
        if (shouldSkipLoader) return;
        const wordDuration = 280;

        if (index < words.length - 1) {
            const timeout = setTimeout(() => {
                setIndex((prev) => prev + 1);
            }, wordDuration);
            return () => clearTimeout(timeout);
        }
    }, [index, shouldSkipLoader]);

    // Wait for the word sequence to finish. 3D modules are lazy-loaded after first paint.
    useEffect(() => {
        if (shouldSkipLoader) return;
        if (index === words.length - 1) {
            const timeout = setTimeout(() => {
                setIsLoading(false);
            }, 450);
            return () => clearTimeout(timeout);
        }
    }, [index, setIsLoading, shouldSkipLoader]);



    // Safety fallback: Force unlock after 6 seconds in case 3D hangs
    useEffect(() => {
        if (shouldSkipLoader) return;
        const fallback = setTimeout(() => {
            setIsLoading(false);
        }, 4000);
        return () => clearTimeout(fallback);
    }, [setIsLoading, shouldSkipLoader]);

    if (shouldSkipLoader) {
        return null;
    }



    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
                >
                    <div className="relative flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={index === 0 
                                    ? { opacity: 1, y: 0, filter: isMobile ? undefined : "blur(0px)" } 
                                    : { opacity: 0, y: 20, filter: isMobile ? undefined : "blur(10px)" }
                                }
                                animate={{ opacity: 1, y: 0, filter: isMobile ? undefined : "blur(0px)" }}
                                exit={{ opacity: 0, y: -20, filter: isMobile ? undefined : "blur(10px)" }}
                                transition={{ duration: 0.2 }}
                                className="text-4xl md:text-6xl font-display font-bold text-gradient tracking-tight text-center leading-[1.2] pb-1"
                            >
                                {words[index]}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PremiumLoader;
