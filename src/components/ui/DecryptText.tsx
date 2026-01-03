import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DecryptTextProps {
    text: string;
    className?: string;
    speed?: number;
    maxIterations?: number;
    revealDirection?: "start" | "end" | "center";
    useOriginalCharsOnly?: boolean;
}

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

export const DecryptText = ({
    text,
    className = "",
    speed = 30,
    maxIterations = 10,
}: DecryptTextProps) => {
    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startScramble = () => {
        setIsHovering(true);
        let iteration = 0;

        clearInterval(intervalRef.current as NodeJS.Timeout);

        intervalRef.current = setInterval(() => {
            setDisplayText((prev) =>
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current as NodeJS.Timeout);
            }

            iteration += 1 / 3;
        }, speed);
    };

    const stopScramble = () => {
        setIsHovering(false);
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setDisplayText(text);
    };

    return (
        <motion.span
            className={`inline-block whitespace-nowrap cursor-pointer ${className}`}
            onMouseEnter={startScramble}
            onMouseLeave={stopScramble}
        >
            {displayText}
        </motion.span>
    );
};

export default DecryptText;
