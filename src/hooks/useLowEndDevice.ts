import { useEffect, useState } from "react";

export const useLowEndDevice = () => {
  const [isLowEnd, setIsLowEnd] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLowEnd(false);
      return;
    }

    const navigatorAny = navigator as unknown as {
      deviceMemory?: number;
      hardwareConcurrency?: number;
      connection?: { effectiveType?: string; saveData?: boolean };
    };

    // Unreported counts as capable: Safari and Firefox never report memory
    const cores = typeof navigatorAny.hardwareConcurrency === "number" ? navigatorAny.hardwareConcurrency : 8;
    const memory = typeof navigatorAny.deviceMemory === "number" ? navigatorAny.deviceMemory : 8;
    const effectiveType = navigatorAny.connection?.effectiveType || "";

    // Budget laptops report 4 threads or 4 GB; smooth scrolling stalls on them, so they keep native scrolling.
    // "3g" is excluded on purpose: browsers report it for many ordinary connections,
    // and it says nothing about what the device can render.
    const lowEnd =
      cores <= 4 ||
      memory <= 4 ||
      navigatorAny.connection?.saveData === true ||
      effectiveType === "slow-2g" ||
      effectiveType === "2g";

    setIsLowEnd(lowEnd);
  }, []);

  return isLowEnd;
};
