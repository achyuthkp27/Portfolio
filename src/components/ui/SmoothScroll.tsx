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
        if (isMobile) return;

        const lenisInstance = new Lenis({
            duration: 1.5,
            easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), // Exponential ease out for general scroll
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.8, // Lower multiplier for "weighty" feel
            touchMultiplier: 2,
        });

        setLenis(lenisInstance);

        function raf(time: number) {
            lenisInstance.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenisInstance.destroy();
        };
    }, [isMobile]);

    return (
        <SmoothScrollContext.Provider value={{ lenis }}>
            {children}
        </SmoothScrollContext.Provider>
    );
};

export default SmoothScroll;
