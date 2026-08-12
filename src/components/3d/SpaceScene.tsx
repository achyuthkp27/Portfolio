import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { AdditiveBlending, Color, DoubleSide, MathUtils } from "three";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { Play, Pause } from "lucide-react";

const HeroObjectFixed = ({ animEnabled }: { animEnabled: boolean }) => {
    const groupRef = useRef<Group>(null);
    const shockwaveRef = useRef<Mesh>(null);
    const shockwaveRef2 = useRef<Mesh>(null);
    const mainMatRef = useRef<MeshStandardMaterial>(null);
    const innerMatRef = useRef<MeshStandardMaterial>(null);
    const { invalidate } = useThree();

    const [hovered, setHovered] = useState(false);

    // Reset the cursor if the scene unmounts while hovered
    useEffect(() => {
        return () => { document.body.style.cursor = ''; };
    }, []);

    // Theme-aware base color
    const getBaseColor = () => {
        const theme = document.documentElement.getAttribute('data-theme');
        return theme === 'light' ? new Color("#222222") : new Color("#ffffff");
    };

    useFrame((state) => {
        if (!animEnabled && !hovered) return;
        if (!groupRef.current || !shockwaveRef.current || !shockwaveRef2.current || !mainMatRef.current || !innerMatRef.current) return;

        const time = state.clock.elapsedTime;

        if (hovered && animEnabled) {
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
        <Float speed={animEnabled ? 2 : 0} rotationIntensity={animEnabled ? 0.5 : 0} floatIntensity={animEnabled ? 0.5 : 0}>
            <group
                onPointerOver={() => {
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    document.body.style.cursor = 'pointer';
                    setHovered(true);
                }}
                onPointerOut={() => {
                    if (window.innerWidth <= 1024 || !animEnabled) return;
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

const Scene = ({ animEnabled }: { animEnabled: boolean }) => {
    return (
        <>
            <HeroObjectFixed animEnabled={animEnabled} />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        </>
    );
};

const SpaceScene = () => {
    const [animEnabled, setAnimEnabled] = useState(false);

    return (
        <div className="absolute inset-0 z-0">
            <Canvas gl={{ antialias: false, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: false }} dpr={[1, 1.25]} frameloop="demand">
                <Scene animEnabled={animEnabled} />
            </Canvas>

            <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-50">
                <button
                    onClick={() => setAnimEnabled(!animEnabled)}
                    className="p-4 rounded-full bg-black/40 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all group"
                    aria-label={animEnabled ? "Pause animation" : "Play animation"}
                    title={animEnabled ? "Pause animation" : "Play animation"}
                >
                    {animEnabled ? (
                        <Pause className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    ) : (
                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default SpaceScene;
