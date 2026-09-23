import { createContext, useContext } from "react";
import type Lenis from "lenis";

type SmoothScrollContextType = {
  lenis: Lenis | null;
};

export const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null });

export const useSmoothScroll = () => useContext(SmoothScrollContext);
