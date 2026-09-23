import { useEffect, useState } from "react";

/**
 * One answer to "should this move?": the OS reduced-motion setting, or the visitor's own
 * switch in the footer. The switch is stored per browser and mirrored onto <html> as
 * data-motion="off" so CSS can honour it too.
 */
const KEY = "motion";
const EVENT = "motion-preference";

export const isMotionOff = () => {
  try {
    return localStorage.getItem(KEY) === "off";
  } catch {
    return false;
  }
};

export const prefersReducedMotion = () =>
  (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) || isMotionOff();

const apply = (off: boolean) => {
  document.documentElement.toggleAttribute("data-motion-off", off);
  if (off) document.documentElement.setAttribute("data-motion", "off");
  else document.documentElement.removeAttribute("data-motion");
};

/** Call once before the first render so the attribute is in place for CSS. */
export const initMotionPreference = () => apply(isMotionOff());

export const setMotionOff = (off: boolean) => {
  try {
    if (off) localStorage.setItem(KEY, "off");
    else localStorage.removeItem(KEY);
  } catch {
    // Private mode: the switch still works for this page view
  }
  apply(off);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: off }));
};

/** The visitor's switch, live. */
export const useMotionOff = () => {
  const [off, setOff] = useState(isMotionOff);
  useEffect(() => {
    const on = (e: Event) => setOff(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return off;
};
