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

    const cores = typeof navigatorAny.hardwareConcurrency === "number" ? navigatorAny.hardwareConcurrency : 4;
    const memory = typeof navigatorAny.deviceMemory === "number" ? navigatorAny.deviceMemory : 4;
    const effectiveType = navigatorAny.connection?.effectiveType || "";

    // "3g" is excluded on purpose: browsers report it for many ordinary connections,
    // and it says nothing about whether the device can render the 3D scene.
    const lowEnd =
      cores <= 2 ||
      memory <= 2 ||
      navigatorAny.connection?.saveData === true ||
      effectiveType === "slow-2g" ||
      effectiveType === "2g";

    setIsLowEnd(lowEnd);
  }, []);

  return isLowEnd;
};
