import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import Lenis from "lenis";
import { useMobile } from "@/hooks/useMobile";

type SmoothScrollContextType = {
    lenis: Lenis | null;
};

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const isMobile = useMobile();

    useEffect(() => {
        // Initialize Lenis only on desktop/larger screens for performance
        // (Or enable everywhere if desired, but disabling on mobile is often safer for native feel)
        if (isMobile) return;

        const lenisInstance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing for "luxury" feel
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        // Sync with Framer Motion or other animation loops if necessary
        // but basics:
        function raf(time: number) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
        setLenis(lenisInstance);

        return () => {
            lenisInstance.destroy();
            setLenis(null);
        };
    }, [isMobile]);

    return (
        <SmoothScrollContext.Provider value={{ lenis }}>
            {children}
        </SmoothScrollContext.Provider>
    );
};

export default SmoothScroll;
