import { useEffect } from "react";
import type Lenis from "lenis";

/**
 * Holds the page still while an overlay is open: body overflow hidden and the smooth
 * scroller paused. Restores whatever was there before when the overlay closes or unmounts.
 */
export const useScrollLock = (locked: boolean, lenis?: Lenis | null) => {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = previous;
      lenis?.start();
    };
  }, [locked, lenis]);
};

export default useScrollLock;
