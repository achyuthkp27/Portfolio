/** A phone's address bar showing or hiding changes the window's height by less than this, in px */
const BAR = 160;

/** True on touch-first devices, where the address bar comes and goes as you scroll */
export const isTouchFirst = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

/**
 * Calls `fn` when a resize changes the layout. On touch-first devices that means a width change
 * or a large height change: iOS shows and hides its address bar as you scroll and fires resize
 * each time, and rebuilding a scene on every one of those is what made scrolling stutter.
 * Elsewhere every resize counts. Returns the cleanup.
 */
export const onLayoutResize = (fn: () => void) => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  const touch = isTouchFirst();
  const handler = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (touch && w === width && Math.abs(h - height) < BAR) return;
    width = w;
    height = h;
    fn();
  };
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
};
