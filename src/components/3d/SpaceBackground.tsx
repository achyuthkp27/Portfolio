import { lazy, Suspense, useRef, useState, useEffect } from "react";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";
import { useMobile } from "@/hooks/useMobile";

const SpaceStarsCanvas = lazy(() => import("@/components/3d/SpaceStarsCanvas"));

const SpaceBackground = () => {
    const isMobile = useMobile();
    const isLowEnd = useLowEndDevice();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);

    useEffect(() => {
        if (isMobile || isLowEnd !== false || !containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0 }
        );
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [isMobile, isLowEnd]);

    useEffect(() => {
        if (isMobile || isLowEnd !== false) return;

        let idleId: any;
        const handleIdle = () => setShowCanvas(true);

        const win = typeof window !== "undefined" ? window as any : null;
        if (!win) return;

        if (win.requestIdleCallback) {
            idleId = win.requestIdleCallback(handleIdle, { timeout: 1500 });
        } else {
            idleId = setTimeout(handleIdle, 1500);
        }

        return () => {
            if (idleId !== undefined) {
                if (win.cancelIdleCallback) {
                    win.cancelIdleCallback(idleId);
                } else {
                    clearTimeout(idleId);
                }
            }
        };
    }, [isMobile, isLowEnd]);

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
            {isVisible && showCanvas && (
                <Suspense fallback={null}>
                    <SpaceStarsCanvas />
                </Suspense>
            )}
        </div>
    );
};

export default SpaceBackground;
