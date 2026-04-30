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
        if (isMobile || isLowEnd !== false || !isVisible || showCanvas) return;

        let idleId: ReturnType<typeof setTimeout> | number | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const mountCanvas = () => setShowCanvas(true);
        const handleInteraction = () => mountCanvas();

        const addInteractionListeners = () => {
            if (typeof window === "undefined") return;
            const opts = { once: true, passive: true } as AddEventListenerOptions;
            window.addEventListener("scroll", handleInteraction, opts);
            window.addEventListener("mousemove", handleInteraction, opts);
            window.addEventListener("keydown", handleInteraction, opts);
            window.addEventListener("touchstart", handleInteraction, opts);
        };

        const removeInteractionListeners = () => {
            if (typeof window === "undefined") return;
            window.removeEventListener("scroll", handleInteraction);
            window.removeEventListener("mousemove", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            window.removeEventListener("touchstart", handleInteraction);
        };

        const scheduleIdleMount = () => {
            if (typeof window === "undefined") return;
            if (typeof window.requestIdleCallback === "function") {
                idleId = window.requestIdleCallback(mountCanvas, { timeout: 12000 });
            } else {
                idleId = setTimeout(mountCanvas, 12000);
            }
        };

        addInteractionListeners();
        if (typeof window !== "undefined") {
            timeoutId = setTimeout(scheduleIdleMount, 10000);
        }

        return () => {
            removeInteractionListeners();
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
            if (idleId !== undefined) {
                if (typeof window !== "undefined" && typeof window.cancelIdleCallback === "function") {
                    window.cancelIdleCallback(idleId as number);
                } else {
                    clearTimeout(idleId as ReturnType<typeof setTimeout>);
                }
            }
        };
    }, [isMobile, isLowEnd, isVisible, showCanvas]);

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
