import { ReactNode, useEffect, useState } from "react";
import { prefersReducedMotion, useMotionOff } from "@/lib/motionPreference";
import type Lenis from "lenis";
import { SmoothScrollContext } from "@/context/smoothScroll";
import { useMobile } from "@/hooks/useMobile";
import { markLowEnd, useLowEndDevice } from "@/hooks/useLowEndDevice";

/** Scrolling frames sampled before judging the machine, and the median frame time that counts as struggling (~35fps) */
const SAMPLE_FRAMES = 90;
const SLOW_FRAME_MS = 28;
/**
 * A frame longer than two 60Hz vsyncs was dropped. A machine can hold a 60fps median and still
 * stutter in bursts, so a window where this share of frames dropped also counts as struggling.
 */
const DROPPED_FRAME_MS = 33;
const DROPPED_SHARE = 0.2;
/** A gap this long means the loop was paused (tab hidden, machine asleep), not that a frame ran slow */
const PAUSED_GAP_MS = 1000;

/**
 * Judges one window of scrolling frame times. A slow median trips at once. Bursty dropped frames
 * must show up in two windows in a row, so one long task (a lazy section mounting, say) can't
 * switch smooth scrolling off for good on a machine that is otherwise fast.
 * Exported for its tests; it never changes at runtime, so fast refresh losing this file's state is harmless.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const judgeFrames = (frames: readonly number[], previousWindowDropped: boolean) => {
  const sorted = [...frames].sort((a, b) => a - b);
  const median = sorted[sorted.length >> 1] ?? 0;
  const droppedCount = frames.filter((ms) => ms > DROPPED_FRAME_MS).length;
  const dropped = frames.length > 0 && droppedCount / frames.length >= DROPPED_SHARE;
  return { slow: median > SLOW_FRAME_MS || (dropped && previousWindowDropped), dropped };
};

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

    // Set when this effect is torn down. The import below can resolve after that, and must then do nothing.
    let cancelled = false;
    let lenisInstance: Lenis | null = null;
    let rafId = 0;
    let last = 0;
    let wasScrolling = false;
    let previousWindowDropped = false;
    const frames: number[] = [];

    // A hidden tab pauses the loop, so the first delta after it spans the whole absence. Start the count afresh.
    const onVisibilityChange = () => {
      last = 0;
      frames.length = 0;
      previousWindowDropped = false;
    };

    // Lenis moves the page from the main thread, so on a machine that can't hold the frame rate
    // the page stalls mid-scroll. Watch frame times while scrolling and, if they run slow,
    // hand scrolling back to the browser, which keeps it moving on its own thread.
    function raf(time: number) {
      if (!lenisInstance) return;
      lenisInstance.raf(time);
      const scrolling = Boolean(lenisInstance.isScrolling);
      const delta = time - last;
      // The first frame of a gesture carries whatever ran before it started, so it says nothing about scrolling
      if (scrolling && wasScrolling && last && !document.hidden && delta < PAUSED_GAP_MS) {
        frames.push(delta);
        if (frames.length >= SAMPLE_FRAMES) {
          const verdict = judgeFrames(frames, previousWindowDropped);
          frames.length = 0;
          previousWindowDropped = verdict.dropped;
          if (verdict.slow) {
            // The rest of the page eases off too: per-letter text reveals stop (see index.css)
            markLowEnd();
            setTooSlow(true);
            return;
          }
        }
      }
      wasScrolling = scrolling;
      last = time;
      rafId = requestAnimationFrame(raf);
    }

    // Loaded only here: phones, budget laptops and reduced-motion visitors never download it
    import("lenis")
      .then(({ default: LenisClass }) => {
        if (cancelled) return;
        lenisInstance = new LenisClass({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing for "luxury" feel
          orientation: "vertical",
          gestureOrientation: "vertical",
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        });
        document.addEventListener("visibilitychange", onVisibilityChange);
        rafId = requestAnimationFrame(raf);
        setLenis(lenisInstance);
      })
      .catch(() => {
        // The chunk failed to load (offline, a stale deploy). The browser's own scrolling carries on.
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      lenisInstance?.destroy();
      lenisInstance = null;
      setLenis(null);
    };
  }, [isMobile, isLowEnd, tooSlow, motionOff]);

  return <SmoothScrollContext.Provider value={{ lenis }}>{children}</SmoothScrollContext.Provider>;
};

export default SmoothScroll;
