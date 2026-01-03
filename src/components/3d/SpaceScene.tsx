import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, PerspectiveCamera } from "@react-three/drei";
import { getProject } from "@theatre/core";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// import studio from "@theatre/studio"; // Dynamically imported below

// Initialize Theater Project
const demoSheet = getProject("Portfolio Animation").sheet("Hero Scene");

const HeroObjectFixed = () => {
    const groupRef = useRef<THREE.Group>(null);
    const shockwaveRef = useRef<THREE.Mesh>(null);
    const shockwaveRef2 = useRef<THREE.Mesh>(null); // Added a second ring for layered effect
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!groupRef.current || !shockwaveRef.current || !shockwaveRef2.current) return;

        const time = state.clock.elapsedTime;

        if (hovered) {
            // --- 1. Smooth Circling/"Shaking" (Orbital Wobble) ---
            // Using sin/cos at different frequencies for organic movement
            const shakeSpeed = 5;
            const shakeAmp = 0.1; // Amplitude of the wobble
            groupRef.current.position.x = Math.sin(time * shakeSpeed) * shakeAmp;
            groupRef.current.position.y = Math.cos(time * shakeSpeed * 0.8) * shakeAmp;
            groupRef.current.position.z = Math.sin(time * shakeSpeed * 1.2) * shakeAmp;

            // --- 2. Expanding Beam (Ripple Effect) ---
            // Loop 1
            const speed = 1.5;
            const maxScale = 15; // Go off-screen/large

            // Phase goes from 0 to 1 repeatedly
            const phase1 = (time * speed) % 1;
            const scale1 = 2 + phase1 * maxScale; // Start at size 2, expand to max
            const opacity1 = (1 - phase1) * 0.5; // Fade out as it expands

            shockwaveRef.current.scale.setScalar(scale1);
            (shockwaveRef.current.material as THREE.MeshStandardMaterial).opacity = opacity1;
            shockwaveRef.current.rotation.z -= 0.01; // Slow spin

            // Loop 2 (Offset by 0.5 for continuous feel)
            const phase2 = ((time * speed) + 0.5) % 1;
            const scale2 = 2 + phase2 * maxScale;
            const opacity2 = (1 - phase2) * 0.3;

            shockwaveRef2.current.scale.setScalar(scale2);
            (shockwaveRef2.current.material as THREE.MeshStandardMaterial).opacity = opacity2;
            shockwaveRef2.current.rotation.z += 0.01;

        } else {
            // --- Reset Logic ---
            // Smoothly return object to center
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
            groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, 0, 0.1);

            // Hide Beams
            shockwaveRef.current.scale.setScalar(0.01);
            (shockwaveRef.current.material as THREE.MeshStandardMaterial).opacity = 0;
            shockwaveRef2.current.scale.setScalar(0.01);
            (shockwaveRef2.current.material as THREE.MeshStandardMaterial).opacity = 0;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
            >
                {/* Main Object */}
                <group ref={groupRef}>
                    <e.group theatreKey="HeroObject">
                        <mesh scale={[2, 2, 1.5]}>
                            <icosahedronGeometry args={[1, 1]} />
                            <meshStandardMaterial
                                color="#ffffff"
                                emissive="#ffffff"
                                emissiveIntensity={0.1}
                                wireframe
                                transparent
                                opacity={0.3}
                                roughness={0}
                                metalness={1}
                            />
                        </mesh>
                        <mesh>
                            <icosahedronGeometry args={[1, 0]} />
                            <meshStandardMaterial
                                color="#ffffff"
                                emissive="#ffffff"
                                emissiveIntensity={0.15}
                                transparent
                                opacity={0.15}
                            />
                        </mesh>
                    </e.group>
                </group>

                {/* Expanding Beam 1 */}
                <mesh ref={shockwaveRef} scale={[0.1, 0.1, 0.1]}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={1}
                        transparent
                        opacity={0}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Expanding Beam 2 (Wireframe Ring for texture) */}
                <mesh ref={shockwaveRef2} scale={[0.1, 0.1, 0.1]}>
                    <ringGeometry args={[0.9, 1, 64]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#ffffff"
                        emissiveIntensity={1}
                        transparent
                        opacity={0}
                        wireframe={false}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </group>
        </Float>
    );
}

const Scene = () => {
    return (
        <>
            <e.pointLight theatreKey="GreenLight" position={[10, 10, 10]} intensity={2} color="#4ade80" />
            <e.pointLight theatreKey="BlueLight" position={[-10, 0, -10]} intensity={1} color="#3b82f6" />

            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

            <HeroObjectFixed />

            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        </>
    );
};

const SpaceScene = () => {
    // Enable studio only in development
    useEffect(() => {
        if (import.meta.env.DEV) {
            import("@theatre/studio").then((module) => {
                module.default.initialize();
                // Check if project is ready before playing
                demoSheet.project.ready.then(() => {
                    demoSheet.sequence.play({ iterationCount: Infinity, range: [0, 10] });
                });
            });
        }
    }, []);

    return (
        <div className="absolute inset-0 z-0">
            <Canvas gl={{ preserveDrawingBuffer: true, alpha: true }}>
                <SheetProvider sheet={demoSheet}>
                    <Scene />
                </SheetProvider>
            </Canvas>
        </div>
    );
};

export default SpaceScene;
