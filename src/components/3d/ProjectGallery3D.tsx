import { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, Scroll, Image as DreiImage, Text, useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { Project } from '@/data/projects';
import { Link } from 'react-router-dom';
import { useLowEndDevice } from '@/hooks/useLowEndDevice';

function CarouselItem({ project, index, count }: { project: Project, index: number, count: number }) {
  const ref = useRef<any>(null);
  const scroll = useScroll();
  const [hovered, hover] = useState(false);
  
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Smooth damp the scale based on hover
    ref.current.scale.x = THREE.MathUtils.damp(ref.current.scale.x, hovered ? 1.05 : 1, 4, delta);
    ref.current.scale.y = THREE.MathUtils.damp(ref.current.scale.y, hovered ? 1.05 : 1, 4, delta);
    
    // Parallax logic based on scroll
    // Scroll.offset goes from 0 to 1
    const offset = (index / count) - scroll.offset;
    // Map offset to position and rotation
    const radius = 8;
    const angle = offset * Math.PI * 1.5;
    
    const targetX = Math.sin(angle) * radius;
    const targetZ = Math.cos(angle) * radius - radius; // curve backwards
    const targetRotationY = -angle * 0.5;

    ref.current.position.x = THREE.MathUtils.damp(ref.current.position.x, targetX, 4, delta);
    ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, targetZ, 4, delta);
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, targetRotationY, 4, delta);
  });

  return (
    <group ref={ref}>
      {project.image ? (
        <DreiImage
          url={project.image}
          transparent
          side={THREE.DoubleSide}
          scale={[5, 3]}
          position={[0, 0.5, 0]}
          onPointerOver={(e) => { e.stopPropagation(); hover(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { hover(false); document.body.style.cursor = 'auto'; }}
          onClick={(e) => {
            // Can't use React Router Link inside Canvas easily without standard HTML wrappers,
            // so we dispatch a custom event or navigate programmatically if provided
            window.location.hash = `/project/${project.slug}`;
          }}
        />
      ) : (
        <mesh position={[0, 0.5, 0]}>
          <planeGeometry args={[5, 3]} />
          <meshBasicMaterial color="#111" wireframe={hovered} />
        </mesh>
      )}

      {/* Glass overlay on un-hovered */}
      <mesh position={[0, 0.5, 0.01]}>
        <planeGeometry args={[5, 3]} />
        <meshBasicMaterial color="black" transparent opacity={hovered ? 0 : 0.4} />
      </mesh>

      <Text
        position={[-2.4, -1.2, 0.1]}
        fontSize={0.25}
        anchorX="left"
        anchorY="top"
        color="white"
      >
        {project.title.toUpperCase()}
      </Text>
      
      <Text
        position={[-2.4, -1.6, 0.1]}
        fontSize={0.12}
        anchorX="left"
        anchorY="top"
        color="#10b981"
        maxWidth={4.8}
      >
        {project.tags.join(" // ")}
      </Text>
    </group>
  );
}

function WebGLGallery({ projects }: { projects: Project[] }) {
  const { width } = useThree((state) => state.viewport);
  return (
    <ScrollControls pages={projects.length} damping={0.25} horizontal={width < 5 ? true : false}>
      <Scroll>
        <group position={[0, -0.5, 0]}>
          {projects.map((project, index) => (
            <CarouselItem key={project.slug} project={project} index={index} count={projects.length} />
          ))}
        </group>
      </Scroll>
    </ScrollControls>
  );
}

export default function ProjectGallery3D({ projects }: { projects: Project[] }) {
  const isLowEnd = useLowEndDevice();

  if (isLowEnd !== false) {
    return (
      <div className="w-full h-[80vh] bg-black relative border-b border-t border-white/5 font-mono flex items-center justify-center text-center px-6">
        <div className="max-w-2xl text-sm text-white/70 leading-relaxed">
          The 3D gallery is disabled on low-end devices to preserve smooth scrolling and keep interactions responsive.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[80vh] bg-black relative border-b border-t border-white/5 font-mono cursor-grab active:cursor-grabbing">
        {/* Helper UI */}
        <div className="absolute top-4 left-6 z-10 opacity-50 text-[10px] tracking-widest pointer-events-none">
            [ 3D_DATA_GALLERY_ACTIVE ]
        </div>
        <div className="absolute bottom-4 right-6 z-10 opacity-50 text-[10px] tracking-widest pointer-events-none">
            DRAG_TO_ROTATE // CLICK_TO_DEPLOY
        </div>

        <Canvas camera={{ position: [0, 0, 8], fov: 35 }}>
            <fog attach="fog" args={['#000', 8, 20]} />
            <ambientLight intensity={0.5} />
            <WebGLGallery projects={projects} />
        </Canvas>
    </div>
  );
}
