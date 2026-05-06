import { useEffect, useState } from "react";

/**
 * Defers mounting of expensive components until the browser is idle or
 * the user interacts — whichever comes first.
 *
 * Replaces the copy-pasted idle-mount pattern that was in App.tsx,
 * Hero.tsx, and SpaceBackground.tsx.
 *
 * @param shouldMount  – gate condition (e.g. `!isLoading && !isMobile`)
 * @param delay        – ms to wait before scheduling an idle callback (default 8000)
 * @param idleTimeout  – max ms the idle callback can wait (default 12000)
 * @returns `true` once the component should be rendered
 */
export function useIdleMount(
  shouldMount: boolean,
  delay: number = 8000,
  idleTimeout: number = 12000,
): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!shouldMount || isReady) return;

    let idleId: ReturnType<typeof setTimeout> | number | undefined;

    const mount = () => {
      setIsReady(true);
      removeListeners();
    };

    // --- interaction listeners (mount immediately on any user gesture) ---
    const handleInteraction = () => mount();

    const opts = { once: true, passive: true } as AddEventListenerOptions;

    const addListeners = () => {
      window.addEventListener("scroll", handleInteraction, opts);
      window.addEventListener("mousemove", handleInteraction, opts);
      window.addEventListener("keydown", handleInteraction, opts);
      window.addEventListener("touchstart", handleInteraction, opts);
    };

    const removeListeners = () => {
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };

    // --- idle-based auto-mount after `delay` ms ---
    const scheduleIdleMount = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(mount, { timeout: idleTimeout });
      } else {
        idleId = setTimeout(mount, idleTimeout);
      }
    };

    addListeners();
    const timeoutId = setTimeout(scheduleIdleMount, delay);

    return () => {
      removeListeners();
      clearTimeout(timeoutId);
      if (idleId !== undefined) {
        if (typeof window.cancelIdleCallback === "function") {
          window.cancelIdleCallback(idleId as number);
        } else {
          clearTimeout(idleId as ReturnType<typeof setTimeout>);
        }
      }
    };
  }, [shouldMount, isReady, delay, idleTimeout]);

  return isReady;
}
