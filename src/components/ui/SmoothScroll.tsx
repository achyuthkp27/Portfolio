import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import Lenis from "lenis";
import { useMobile } from "@/hooks/useMobile";

type SmoothScrollContextType = {
    lenis: Lenis | null;
};

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
    // Lenis Disabled: Reverting to native scroll for maximum stability
    const [lenis] = useState<Lenis | null>(null);

    return (
        <SmoothScrollContext.Provider value={{ lenis }}>
            {children}
        </SmoothScrollContext.Provider>
    );
};

export default SmoothScroll;
