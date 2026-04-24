import { motion, useInView, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useMobile } from "@/hooks/useMobile";

interface TextRevealProps {
    children: ReactNode;
    className?: string;
    type?: "blur-reveal" | "fade-up" | "mask-up" | "scrub";
    delay?: number;
    duration?: number;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
    shouldSplit?: boolean;
    scrollOffset?: any;
}

const TextReveal = ({
    children,
    className = "",
    type = "blur-reveal",
    delay = 0,
    duration = 0.8,
    as: Component = "div",
    shouldSplit = true,
    scrollOffset = ["start 0.9", "start 0.4"]
}: TextRevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-5% 0px" });
    const isMobile = useMobile();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: scrollOffset
    });

    if (type === "scrub" && typeof children === "string") {
        const words = children.split(" ");
        return (
            <Component ref={ref} className={`flex flex-wrap ${className}`}>
                {words.map((word, i) => {
                    const start = i / words.length;
                    const end = start + (1 / words.length);
                    return (
                        <ScrubWord
                            key={i}
                            progress={scrollYProgress}
                            range={[start, end]}
                        >
                            {word}
                        </ScrubWord>
                    );
                })}
            </Component>
        );
    }

    if (type === "mask-up" && typeof children === "string" && shouldSplit) {
        const words = children.split(" ");
        return (
            <Component ref={ref} className={`flex flex-wrap gap-x-[0.25em] ${className}`}>
                {words.map((word, i) => (
                    <div key={i} className="overflow-hidden">
                        <motion.span
                            initial={{ y: "100%", opacity: 0 }}
                            animate={isInView ? { y: 0, opacity: 1 } : {}}
                            transition={{
                                duration: duration,
                                delay: delay + (i * 0.05),
                                ease: [0.16, 1, 0.3, 1]
                            }}
                            className="inline-block origin-top-left"
                        >
                            {word}
                        </motion.span>
                    </div>
                ))}
            </Component>
        );
    }

    if (type === "blur-reveal" && typeof children === "string" && shouldSplit) {
        const words = children.split(" ");

        // Mobile: word-level opacity animation instead of per-character blur
        // filter: blur() is extremely expensive on mobile GPUs
        if (isMobile) {
            return (
                <Component ref={ref} className={`inline-flex flex-wrap gap-x-[0.2em] ${className}`}>
                    {words.map((word, wordIndex) => (
                        <motion.span
                            key={wordIndex}
                            initial={{ opacity: 0, y: 8 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.5,
                                delay: delay + wordIndex * 0.05,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            className="inline-block whitespace-nowrap"
                        >
                            {word}
                        </motion.span>
                    ))}
                </Component>
            );
        }

        // Desktop: per-character blur-reveal (premium effect)
        return (
            <Component ref={ref} className={`inline-flex flex-wrap gap-x-[0.2em] ${className}`}>
                {words.map((word, wordIndex) => (
                    <span key={wordIndex} className="inline-block whitespace-nowrap">
                        {word.split("").map((char, charIndex) => (
                            <motion.span
                                key={charIndex}
                                initial={{ opacity: 0, filter: "blur(10px)", scale: 1.2, y: 5 }}
                                animate={isInView ? { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 } : {}}
                                transition={{
                                    duration: duration,
                                    delay: delay + (wordIndex * 0.1) + (charIndex * 0.02),
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                className="inline-block whitespace-pre"
                            >
                                {char}
                            </motion.span>
                        ))}
                    </span>
                ))}
            </Component>
        );
    }

    // Fallback
    const initial = type === "blur-reveal"
        ? { opacity: 0, filter: isMobile ? undefined : "blur(10px)", scale: isMobile ? 1 : 1.2, y: 5 }
        : { opacity: 0, y: 40 };

    const animate = type === "blur-reveal"
        ? (isInView ? { opacity: 1, filter: isMobile ? undefined : "blur(0px)", scale: 1, y: 0 } : {})
        : (isInView ? { opacity: 1, y: 0 } : {});

    return (
        <Component ref={ref} className={type === "blur-reveal" ? "inline-block" : ""}>
            <motion.span
                initial={initial}
                animate={animate}
                transition={{
                    duration: duration,
                    delay: delay,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className={`inline-block ${className}`}
            >
                {children}
            </motion.span>
        </Component>
    );
};

// Helper for scrub effect to avoid hook-in-loop rules
const ScrubWord = ({ children, progress, range }: { children: string, progress: MotionValue<number>, range: [number, number] }) => {
    const opacity = useTransform(progress, range, [0.1, 1]);
    return (
        <motion.span style={{ opacity }} className="mr-[0.25em]">
            {children}
        </motion.span>
    );
}

export default TextReveal;
