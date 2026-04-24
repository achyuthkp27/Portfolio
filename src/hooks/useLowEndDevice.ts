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
      connection?: { effectiveType?: string };
    };

    const cores = typeof navigatorAny.hardwareConcurrency === "number" ? navigatorAny.hardwareConcurrency : 4;
    const memory = typeof navigatorAny.deviceMemory === "number" ? navigatorAny.deviceMemory : 4;
    const effectiveType = navigatorAny.connection?.effectiveType || "";

    const lowEnd =
      cores <= 2 ||
      memory <= 2 ||
      effectiveType === "slow-2g" ||
      effectiveType === "2g" ||
      effectiveType === "3g";

    setIsLowEnd(lowEnd);
  }, []);

  return isLowEnd;
};
