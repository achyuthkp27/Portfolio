import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const MobileHeroObject = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
            meshRef.current.rotation.x += delta * 0.1;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} scale={[1.8, 1.8, 1.8]}>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.2}
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </mesh>
            <mesh scale={[1.7, 1.7, 1.7]}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.15}
                    transparent
                    opacity={0.08}
                />
            </mesh>
        </Float>
    );
};

export default function MobileSpaceScene() {
    return (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-zinc-950 to-black">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black opacity-30" />
            <Canvas 
                gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} 
                dpr={[1, 1.5]} // Limit pixel ratio to save battery/reduce lag on mobile
            >
                <ambientLight intensity={1} />
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
                <MobileHeroObject />
            </Canvas>
        </div>
    );
}
