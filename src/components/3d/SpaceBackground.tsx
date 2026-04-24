import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useMobile } from "@/hooks/useMobile";

const ParallaxStars = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!group.current) return;
        // Subtle drift
        const { x, y } = state.mouse;
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.05, 0.05);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.05, 0.05);
    });

    return (
        <group ref={group}>
            {/* Reduced particle count from 3000 → 1500 for GPU savings */}
            <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
            {/* Ambient Lights for Depth */}
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#4ade80" />
            <pointLight position={[-10, 0, -10]} intensity={1} color="#3b82f6" />
        </group>
    )
}

const SpaceBackground = () => {
    const isMobile = useMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isMobile || !containerRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [isMobile]);

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="fixed inset-0 z-[-1] pointer-events-none bg-black">
            {isVisible && (
                <Canvas
                    style={{ pointerEvents: 'none' }}
                    gl={{ antialias: false, powerPreference: "high-performance" }}
                    dpr={[1, 1.5]}
                >
                    <ParallaxStars />
                </Canvas>
            )}
        </div>
    );
};

export default SpaceBackground;
