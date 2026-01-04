import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

interface HorizontalScrollSectionProps {
    children: React.ReactNode;
    className?: string;
}

const HorizontalScrollSection = ({ children, className = "" }: HorizontalScrollSectionProps) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Determine how far to scroll horizontally.
    // We scroll -100% of the content width + viewport width.
    // But since 'children' width is unknown until render, we usually assume a wide container.
    // A robust way: transform [0, 1] scrollYProgress to ["0%", "-X%"]
    // For simplicity with generic children, let's assume the children are in a flex-row with wide width.
    // We'll set a generic large X value or rely on the container width. 
    // Usually Horizontal Scroll requires knowing the width.
    // For this implementation, we'll try a common trick: 
    // Scroll x from "1%" to "-95%" (tweak based on content)

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className={`relative h-[300vh] ${className}`}>
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-8">
                    {children}
                </motion.div>
            </div>
        </section>
    );
};

export default HorizontalScrollSection;
