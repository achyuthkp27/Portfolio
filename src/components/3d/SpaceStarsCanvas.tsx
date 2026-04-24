import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const ParallaxStars = () => {
    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (!group.current) return;
        const { x, y } = state.mouse;
        group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, y * 0.05, 0.05);
        group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.05, 0.05);
    });

    return (
        <group ref={group}>
            <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#4ade80" />
            <pointLight position={[-10, 0, -10]} intensity={1} color="#3b82f6" />
        </group>
    );
};

export default function SpaceStarsCanvas() {
    return (
        <Canvas
            style={{ pointerEvents: "none" }}
            gl={{ antialias: false, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
        >
            <ParallaxStars />
        </Canvas>
    );
}
