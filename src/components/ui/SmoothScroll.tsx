import { ReactNode, useEffect, useState } from "react";
import { prefersReducedMotion, useMotionOff } from "@/lib/motionPreference";
import Lenis from "lenis";
import { SmoothScrollContext } from "@/context/smoothScroll";
import { useMobile } from "@/hooks/useMobile";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";

/** Scrolling frames sampled before judging the machine, and the median frame time that counts as struggling (~35fps) */
const SAMPLE_FRAMES = 90;
const SLOW_FRAME_MS = 28;

export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const isMobile = useMobile();
  const isLowEnd = useLowEndDevice();
  // Set once this visit if smooth scrolling can't keep up; native scrolling then stays on
  const [tooSlow, setTooSlow] = useState(false);
  // Live: the footer switch turns smooth scrolling off (and back on) without a reload
  const motionOff = useMotionOff();

  useEffect(() => {
    const reduceMotion = prefersReducedMotion();
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    // Initialize Lenis only on capable pointer devices. Mobile and low-end devices keep native scrolling.
    if (isMobile || isLowEnd !== false || tooSlow || reduceMotion || !finePointer) {
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
    let last = 0;
    const frames: number[] = [];

    // Lenis moves the page from the main thread, so on a machine that can't hold the frame rate
    // the page stalls mid-scroll. Watch frame times while scrolling and, if they run slow,
    // hand scrolling back to the browser, which keeps it moving on its own thread.
    function raf(time: number) {
      lenisInstance.raf(time);
      if (lenisInstance.isScrolling && last) {
        frames.push(time - last);
        if (frames.length >= SAMPLE_FRAMES) {
          const median = frames.sort((a, b) => a - b)[frames.length >> 1];
          frames.length = 0;
          if (median > SLOW_FRAME_MS) {
            setTooSlow(true);
            return;
          }
        }
      }
      last = time;
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    setLenis(lenisInstance);

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance.destroy();
      setLenis(null);
    };
  }, [isMobile, isLowEnd, tooSlow, motionOff]);

  return <SmoothScrollContext.Provider value={{ lenis }}>{children}</SmoothScrollContext.Provider>;
};

export default SmoothScroll;
