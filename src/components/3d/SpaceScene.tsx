import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { AdditiveBlending, Color, DoubleSide, MathUtils } from "three";
import type { Group, Mesh, MeshStandardMaterial } from "three";

const HeroObjectFixed = () => {
    const groupRef = useRef<Group>(null);
    const shockwaveRef = useRef<Mesh>(null);
    const shockwaveRef2 = useRef<Mesh>(null);
    const mainMatRef = useRef<MeshStandardMaterial>(null);
    const innerMatRef = useRef<MeshStandardMaterial>(null);
    const { invalidate } = useThree();

    const [hovered, setHovered] = useState(false);
    const settleFrames = useRef(0);

    // Reset the cursor if the scene unmounts while hovered
    useEffect(() => {
        return () => { document.body.style.cursor = ''; };
    }, []);

    const getBaseColor = () => new Color("#ffffff");

    useFrame((state) => {
        if (!hovered && settleFrames.current <= 0) return;
        if (hovered) settleFrames.current = 90;
        else settleFrames.current -= 1;
        if (!groupRef.current || !shockwaveRef.current || !shockwaveRef2.current || !mainMatRef.current || !innerMatRef.current) return;

        const time = state.clock.elapsedTime;

        if (hovered) {
            // Gentle emissive lift and slow ripple on hover — quiet, not a light show
            const baseColor = getBaseColor();
            mainMatRef.current.color.copy(baseColor);
            mainMatRef.current.emissive.copy(baseColor);
            mainMatRef.current.emissiveIntensity = 0.35;
            innerMatRef.current.color.copy(baseColor);

            const speed = 0.6;
            const maxScale = 10;

            const phase1 = (time * speed) % 1;
            shockwaveRef.current.scale.setScalar(2 + phase1 * maxScale);
            (shockwaveRef.current.material as MeshStandardMaterial).opacity = (1 - phase1) * 0.25;
            shockwaveRef.current.rotation.z -= 0.005;

            const phase2 = ((time * speed) + 0.5) % 1;
            shockwaveRef2.current.scale.setScalar(2 + phase2 * maxScale);
            (shockwaveRef2.current.material as MeshStandardMaterial).opacity = (1 - phase2) * 0.15;
            shockwaveRef2.current.rotation.z += 0.005;
        } else {
            // --- Reset Logic ---
            const baseColor = getBaseColor();
            mainMatRef.current.color.copy(baseColor);
            mainMatRef.current.emissive.copy(baseColor);
            mainMatRef.current.emissiveIntensity = 0.1;
            innerMatRef.current.color.copy(baseColor);
            (shockwaveRef.current.material as MeshStandardMaterial).color.copy(baseColor);
            (shockwaveRef2.current.material as MeshStandardMaterial).color.copy(baseColor);

            groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
            groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
            groupRef.current.position.z = MathUtils.lerp(groupRef.current.position.z, 0, 0.1);

            // Hide Beams
            shockwaveRef.current.scale.setScalar(0.01);
            (shockwaveRef.current.material as MeshStandardMaterial).opacity = 0;
            shockwaveRef2.current.scale.setScalar(0.01);
            (shockwaveRef2.current.material as MeshStandardMaterial).opacity = 0;
        }

        invalidate();
    });

    return (
        <Float speed={hovered ? 2 : 0} rotationIntensity={hovered ? 0.5 : 0} floatIntensity={hovered ? 0.5 : 0}>
            <group
                onPointerOver={() => {
                    if (window.innerWidth <= 1024) return;
                    document.body.style.cursor = 'pointer';
                    setHovered(true);
                }}
                onPointerOut={() => {
                    if (window.innerWidth <= 1024) return;
                    document.body.style.cursor = 'auto';
                    setHovered(false);
                }}
            >
                {/* Main Object */}
                <group ref={groupRef}>
                    <group>
                        <mesh scale={[2, 2, 1.5]}>
                            <icosahedronGeometry args={[1, 1]} />
                            <meshStandardMaterial
                                ref={mainMatRef}
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
                                ref={innerMatRef}
                                color="#ffffff"
                                emissive="#ffffff"
                                emissiveIntensity={0.15}
                                transparent
                                opacity={0.15}
                            />
                        </mesh>
                    </group>
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
                        blending={AdditiveBlending}
                        depthWrite={false}
                        side={DoubleSide}
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
                        blending={AdditiveBlending}
                        depthWrite={false}
                        side={DoubleSide}
                    />
                </mesh>
            </group>
        </Float>
    );
}

const Scene = () => {
    return (
        <>
            <HeroObjectFixed />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        </>
    );
};

const SpaceScene = () => {
    return (
        <div className="absolute inset-0 z-0 opacity-60">
            <Canvas gl={{ antialias: false, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: false }} dpr={[1, 1.25]} frameloop="demand">
                <Scene />
            </Canvas>
        </div>
    );
};

export default SpaceScene;
