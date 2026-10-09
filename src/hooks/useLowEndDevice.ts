import { useEffect, useState } from "react";

/**
 * Budget laptops report 4 threads or 4 GB. Unreported counts as capable: Safari and Firefox
 * never report memory. "3g" is excluded on purpose: browsers report it for many ordinary
 * connections, and it says nothing about what the device can render.
 */
export const isLowEndDevice = () => {
  if (typeof window === "undefined") return false;

  const navigatorAny = navigator as unknown as {
    deviceMemory?: number;
    hardwareConcurrency?: number;
    connection?: { effectiveType?: string; saveData?: boolean };
  };

  const cores = typeof navigatorAny.hardwareConcurrency === "number" ? navigatorAny.hardwareConcurrency : 8;
  const memory = typeof navigatorAny.deviceMemory === "number" ? navigatorAny.deviceMemory : 8;
  const effectiveType = navigatorAny.connection?.effectiveType || "";

  return (
    cores <= 4 ||
    memory <= 4 ||
    navigatorAny.connection?.saveData === true ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g"
  );
};

/**
 * Mirrors "this machine is struggling" onto <html> as data-perf="low", so CSS can drop the
 * costliest effects there (see index.css). Set at start on low-end hardware, and later by
 * SmoothScroll if scrolling runs slow on a machine that passed the hardware check.
 */
export const markLowEnd = () => document.documentElement.setAttribute("data-perf", "low");

/** Call once before the first render so the attribute is in place for CSS. */
export const initPerfMode = () => {
  if (isLowEndDevice()) markLowEnd();
};

export const useLowEndDevice = () => {
  const [isLowEnd, setIsLowEnd] = useState<boolean | null>(null);

  useEffect(() => {
    // Budget laptops keep native scrolling: smooth scrolling stalls on them
    setIsLowEnd(isLowEndDevice());
  }, []);

  return isLowEnd;
};
