import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import Lenis from "lenis";
import { useMobile } from "@/hooks/useMobile";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";

type SmoothScrollContextType = {
    lenis: Lenis | null;
};

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const isMobile = useMobile();
    const isLowEnd = useLowEndDevice();

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        // Initialize Lenis only on capable pointer devices. Mobile and low-end devices keep native scrolling.
        if (isMobile || isLowEnd !== false || reduceMotion || !finePointer) {
            setLenis(null);
            return;
        }

        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing for "luxury" feel
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        let rafId: number;

        function raf(time: number) {
            lenisInstance.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);
        setLenis(lenisInstance);

        return () => {
            cancelAnimationFrame(rafId);
            lenisInstance.destroy();
            setLenis(null);
        };
    }, [isMobile, isLowEnd]);

    return (
        <SmoothScrollContext.Provider value={{ lenis }}>
            {children}
        </SmoothScrollContext.Provider>
    );
};

export default SmoothScroll;
