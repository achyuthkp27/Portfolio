import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float, PerspectiveCamera } from "@react-three/drei";
import { getProject } from "@theatre/core";
import { editable as e, SheetProvider } from "@theatre/r3f";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

// Initialize Theater Project
// Initialize Theater Project
// We rely on local storage (Studio) during dev. 
// User should export state to a JSON file for production.
const demoSheet = getProject("Portfolio Animation").sheet("Hero Scene");

export let isDJMuted = true;

// --- Procedural DJ Techno Loop Generator (Zero Copyright!) ---
let audioCtx: AudioContext | null = null;
let djInterval: NodeJS.Timeout | null = null;
let noteStep = 0;

const playDrum = (type: 'kick' | 'hat' | 'bass', time: number) => {
    if (!audioCtx || isDJMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = type === 'bass' ? 800 : 8000;
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'kick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    } else if (type === 'hat') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(8000, time);
        gain.gain.setValueAtTime(0.05, time); 
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05); 
    } else if (type === 'bass') {
        osc.type = 'sawtooth';
        // Minor pentatonic bassline for that classic acid house feel
        const notes = [65.41, 73.42, 77.78, 98.00, 65.41]; 
        osc.frequency.setValueAtTime(notes[Math.floor(Math.random() * notes.length)], time);
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    }
    
    osc.start(time);
    osc.stop(time + 0.5);
};

const startDJ = () => {
    if (!audioCtx) {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if(Ctx) audioCtx = new Ctx();
    }
    if (audioCtx?.state === 'suspended') audioCtx.resume();
    
    if (djInterval) return;
    
    noteStep = 0;
    // 125 BPM = 120ms per 16th note
    djInterval = setInterval(() => {
        if (!audioCtx) return;
        const time = audioCtx.currentTime + 0.05;
        
        if (noteStep % 4 === 0) playDrum('kick', time);
        if (noteStep % 4 === 2) playDrum('hat', time);
        if (noteStep % 16 === 0 || noteStep % 16 === 3 || noteStep % 16 === 7 || noteStep % 16 === 10 || noteStep % 16 === 14) {
            playDrum('bass', time);
        }
        
        noteStep++;
    }, 120);
};

const stopDJ = () => {
    if (djInterval) {
        clearInterval(djInterval);
        djInterval = null;
    }
};

const HeroObjectFixed = ({ animEnabled }: { animEnabled: boolean }) => {
    const groupRef = useRef<THREE.Group>(null);
    const shockwaveRef = useRef<THREE.Mesh>(null);
    const shockwaveRef2 = useRef<THREE.Mesh>(null); 
    const mainMatRef = useRef<THREE.MeshStandardMaterial>(null);
    const innerMatRef = useRef<THREE.MeshStandardMaterial>(null);
    
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (!groupRef.current || !shockwaveRef.current || !shockwaveRef2.current || !mainMatRef.current || !innerMatRef.current) return;

        const time = state.clock.elapsedTime;

        if (hovered && animEnabled) {
            // --- 0. Disco Light Colors ---
            // Cycles through vibrant HSL spectrum to mimic a disco club
            const hue = (time * 0.5) % 1; 
            const discoColor = new THREE.Color().setHSL(hue, 1, 0.5);
            
            mainMatRef.current.color.copy(discoColor);
            mainMatRef.current.emissive.copy(discoColor);
            innerMatRef.current.color.copy(discoColor);
            (shockwaveRef.current.material as THREE.MeshStandardMaterial).color.copy(discoColor);
            (shockwaveRef2.current.material as THREE.MeshStandardMaterial).color.copy(discoColor);

            // --- 1. Smooth Circling/"Shaking" (Orbital Wobble) ---
            const shakeSpeed = 5;
            const shakeAmp = 0.1; 
            groupRef.current.position.x = Math.sin(time * shakeSpeed) * shakeAmp;
            groupRef.current.position.y = Math.cos(time * shakeSpeed * 0.8) * shakeAmp;
            groupRef.current.position.z = Math.sin(time * shakeSpeed * 1.2) * shakeAmp;

            // --- 2. Expanding Beam (Ripple Effect) ---
            const speed = 1.5;
            const maxScale = 15; 

            // Phase goes from 0 to 1 repeatedly
            const phase1 = (time * speed) % 1;
            const scale1 = 2 + phase1 * maxScale; 
            const opacity1 = (1 - phase1) * 0.5; 

            shockwaveRef.current.scale.setScalar(scale1);
            (shockwaveRef.current.material as THREE.MeshStandardMaterial).opacity = opacity1;
            shockwaveRef.current.rotation.z -= 0.01; 

            // Loop 2 
            const phase2 = ((time * speed) + 0.5) % 1;
            const scale2 = 2 + phase2 * maxScale;
            const opacity2 = (1 - phase2) * 0.3;

            shockwaveRef2.current.scale.setScalar(scale2);
            (shockwaveRef2.current.material as THREE.MeshStandardMaterial).opacity = opacity2;
            shockwaveRef2.current.rotation.z += 0.01;

        } else {
            // --- Reset Logic ---
            const whiteColor = new THREE.Color("#ffffff");
            mainMatRef.current.color.copy(whiteColor);
            mainMatRef.current.emissive.copy(whiteColor);
            innerMatRef.current.color.copy(whiteColor);
            (shockwaveRef.current.material as THREE.MeshStandardMaterial).color.copy(whiteColor);
            (shockwaveRef2.current.material as THREE.MeshStandardMaterial).color.copy(whiteColor);

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
        <Float speed={animEnabled ? 2 : 0} rotationIntensity={animEnabled ? 0.5 : 0} floatIntensity={animEnabled ? 0.5 : 0}>
            <group
                onPointerOver={() => { 
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    document.body.style.cursor = 'pointer'; 
                    setHovered(true); 
                    startDJ(); 
                }}
                onPointerOut={() => { 
                    if (window.innerWidth <= 1024 || !animEnabled) return;
                    document.body.style.cursor = 'auto'; 
                    setHovered(false); 
                    stopDJ(); 
                }}
            >
                {/* Main Object */}
                <group ref={groupRef}>
                    <e.group theatreKey="HeroObject">
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

const Scene = ({ animEnabled }: { animEnabled: boolean }) => {
    return (
        <>
            {/* Lights and Stars moved to Global SpaceBackground for continuity */}
            {/* <Stars ... /> */}
            <HeroObjectFixed animEnabled={animEnabled} />

            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        </>
    );
};

const SpaceScene = () => {
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

    const [muted, setMuted] = useState(isDJMuted);
    const [animEnabled, setAnimEnabled] = useState(true);

    useEffect(() => {
        demoSheet.project.ready.then(() => {
            if (animEnabled) {
                demoSheet.sequence.play({ iterationCount: Infinity, range: [0, 10] });
            } else {
                demoSheet.sequence.pause();
            }
        });
    }, [animEnabled]);

    return (
        <div className="absolute inset-0 z-0">
            <Canvas gl={{ preserveDrawingBuffer: true, alpha: true }}>
                <SheetProvider sheet={demoSheet}>
                    <Scene animEnabled={animEnabled} />
                </SheetProvider>
            </Canvas>
            
            <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 z-50 flex gap-4">
                <button
                    onClick={() => {
                        const newAnim = !animEnabled;
                        setAnimEnabled(newAnim);
                        if (!newAnim) stopDJ();
                    }}
                    className="p-4 rounded-full bg-black/40 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all group"
                    title={animEnabled ? "Pause Animation" : "Play Animation"}
                >
                    {animEnabled ? (
                        <Pause className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    ) : (
                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                </button>
                <button
                    onClick={() => {
                        const newMuted = !muted;
                        setMuted(newMuted);
                        isDJMuted = newMuted;
                        if (newMuted) stopDJ();
                    }}
                    className="p-4 rounded-full bg-black/40 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all group"
                    title={muted ? "Unmute DJ" : "Mute DJ"}
                >
                    {muted ? (
                        <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    ) : (
                        <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default SpaceScene;
