import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

interface TextScrambleProps {
    children: string;
    className?: string;
    duration?: number;
    speed?: number;
    delay?: number;
}

const TextScramble = ({
    children,
    className = "",
    duration = 1.5,
    speed = 0.05,
    delay = 0
}: TextScrambleProps) => {
    const [displayText, setDisplayText] = useState("");
    const [isScrambling, setIsScrambling] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let timeout: NodeJS.Timeout;

        // Start after delay
        timeout = setTimeout(() => {
            setIsScrambling(true);
            let iteration = 0;

            interval = setInterval(() => {
                setDisplayText(
                    children
                        .split("")
                        .map((char, index) => {
                            if (index < iteration) {
                                return children[index];
                            }
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("")
                );

                if (iteration >= children.length) {
                    clearInterval(interval);
                    setIsScrambling(false);
                }

                iteration += 1 / (duration * 10); // Adjust speed
            }, speed * 1000);
        }, delay * 1000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [children, duration, speed, delay]);

    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {displayText}
        </motion.span>
    );
};

export default TextScramble;
