import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    color: string;
    speedX: number;
    speedY: number;
}

const ScrollProgress = () => {
    // 1. Core Scroll Progress for the Bar
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    // 2. Particle System
    const [particles, setParticles] = useState<Particle[]>([]);
    const lastScrollY = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Comet Trail Colors: White -> Grey -> Dark
    const colors = ['#ffffff', '#e4e4e7', '#a1a1aa', '#52525b'];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const deltaY = Math.abs(currentScrollY - lastScrollY.current);

            // Only spawn if scrolling significantly
            // if (deltaY > 2) {
            //     spawnParticles(deltaY);
            // }
            lastScrollY.current = currentScrollY;
        };

        const spawnParticles = (speed: number) => {
            if (!containerRef.current) return;

            // Calculate current "Tip" position of the progress bar
            // progress (0-1) * windowWidth
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = window.scrollY / totalHeight;
            const tipX = progress * window.innerWidth;

            const count = Math.min(Math.ceil(speed / 5), 5); // Spawn count based on speed

            const newParticles: Particle[] = [];
            for (let i = 0; i < count; i++) {
                newParticles.push({
                    id: Date.now() + Math.random(),
                    x: tipX - (Math.random() * 10), // Spawn tighter behind the tip
                    y: (Math.random() * 4) - 1, // Spawn from -1px to 3px (centered on 2px bar)
                    size: Math.random() * 2 + 0.5, // Tiny dust
                    opacity: Math.random() * 0.5 + 0.4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speedX: (Math.random() - 0.8) * 2, // Drift LEFT (trail behind)
                    speedY: (Math.random() - 0.5) * 1, // Slight vertical drift
                });
            }
            setParticles(prev => [...prev, ...newParticles].slice(-40)); // Limit active particles
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Animation Loop
    useEffect(() => {
        let animationFrameId: number;
        const animate = () => {
            setParticles(prev => prev
                .map(p => ({
                    ...p,
                    x: p.x - 0.5 + p.speedX, // Continuous drift left
                    y: p.y + p.speedY,
                    opacity: p.opacity - 0.02 // Fade out
                }))
                .filter(p => p.opacity > 0)
            );
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // Transform for comet head position matching the bar
    const x = useTransform(scrollYProgress, (v) => v * (typeof window !== 'undefined' ? window.innerWidth : 0));
    const opacity = useTransform(scrollYProgress, [0, 0.01], [0, 1]);

    return (
        <div ref={containerRef} className="fixed top-0 left-0 right-0 z-[100] h-4 pointer-events-none">
            {/* The Main Progress Bar (Beam) */}
            <motion.div
                className="absolute top-0 left-0 bottom-0 bg-white shadow-[0_0_10px_white]"
                style={{
                    scaleX,
                    transformOrigin: "left",
                    height: '2px', // Thin beam
                }}
            />

            {/* The Comet Head (Glowing Tip) */}
            <motion.div
                className="absolute top-0 h-1 w-4 bg-white rounded-full shadow-[0_0_15px_2px_rgba(255,255,255,0.8)] blur-[1px]"
                style={{
                    left: 0,
                    x,
                    top: '-1px', // Center on the 2px bar
                    opacity
                }}
            />

            {/* Particle Trail Container */}
            <div className="absolute inset-0 overflow-hidden">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute rounded-full"
                        style={{
                            left: p.x,
                            top: p.y,
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            opacity: p.opacity,
                            boxShadow: `0 0 4px ${p.color}`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ScrollProgress;
