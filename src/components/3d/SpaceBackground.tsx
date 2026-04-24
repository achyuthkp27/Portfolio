import { lazy, Suspense, useRef, useState, useEffect } from "react";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";
import { useMobile } from "@/hooks/useMobile";

const SpaceStarsCanvas = lazy(() => import("@/components/3d/SpaceStarsCanvas"));

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

    const isLowEnd = useLowEndDevice();

    if (isMobile || isLowEnd !== false) {
        return (
            <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black opacity-40" />
            </div>
        );
    }

    return (
        <div ref={containerRef} className="fixed inset-0 z-[-1] pointer-events-none bg-black">
            {isVisible && (
                <Suspense fallback={null}>
                    <SpaceStarsCanvas />
                </Suspense>
            )}
        </div>
    );
};

export default SpaceBackground;
