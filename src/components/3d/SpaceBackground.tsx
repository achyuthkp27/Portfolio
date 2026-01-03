import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const ParallaxStars = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!group.current) return;
        // Subtle drift based on mouse position
        const { x, y } = state.mouse;
        // LERP for smoothness
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.1, 0.05);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.1, 0.05);
    });

    return (
        <group ref={group}>
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        </group>
    )
}

const SpaceBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
            <Canvas gl={{ preserveDrawingBuffer: true }} style={{ pointerEvents: 'none' }}>
                <ParallaxStars />
            </Canvas>
        </div>
    );
};

export default SpaceBackground;
