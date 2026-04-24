import { motion } from "framer-motion";

export const Logo = ({ className = "" }: { className?: string }) => {
    const logoSrc = `${import.meta.env.BASE_URL}images/logo.webp`;

    return (
        <motion.div
            className={`relative w-10 h-10 flex items-center justify-center ${className}`}
            whileHover={{ scale: 1.05 }}
        >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />

            <img
                src={logoSrc}
                alt="Achyuth KP Portfolio Logo"
                className="w-full h-full object-contain rounded-xl relative z-10"
            />
        </motion.div>
    );
};

export default Logo;
