import { motion } from "framer-motion";

interface ShockwaveWrapperProps {
    children: React.ReactNode;
    color?: string;
    className?: string;
}

const ShockwaveWrapper = ({
    children,
    color = "primary",
    className = ""
}: ShockwaveWrapperProps) => {
    return (
        <div className={`relative group ${className}`}>
            {/* 1. Subtle Breathing Glow */}
            <motion.div
                animate={{
                    opacity: [0.05, 0.4, 0.05],
                    boxShadow: [
                        `0 0 10px 2px hsl(var(--${color}) / 0.1)`,
                        `0 0 25px 5px hsl(var(--${color}) / 0.2)`,
                        `0 0 10px 2px hsl(var(--${color}) / 0.1)`,
                    ]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-2xl -z-10 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
            />

            {/* 2. Gentle Pulse Wave */}
            <div className="absolute inset-0 -z-30 overflow-visible pointer-events-none">
                <motion.div
                    className="absolute inset-0 rounded-2xl border"
                    style={{ borderColor: `hsl(var(--${color}) / 0.3)` }}
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.15, opacity: 0, borderWidth: "0px" }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeOut"
                    }}
                />
            </div>

            {children}
        </div>
    );
};

export default ShockwaveWrapper;
