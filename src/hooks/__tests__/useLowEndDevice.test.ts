import { describe, it, expect, afterEach } from "vitest";
import { initPerfMode, isLowEndDevice, markLowEnd } from "../useLowEndDevice";

const setHardware = ({ cores, memory }: { cores?: number; memory?: number }) => {
  Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, get: () => cores });
  Object.defineProperty(navigator, "deviceMemory", { configurable: true, get: () => memory });
};

describe("isLowEndDevice", () => {
  afterEach(() => {
    setHardware({ cores: 8, memory: 8 });
    document.documentElement.removeAttribute("data-perf");
  });

  it("treats a 4-thread laptop as low-end", () => {
    setHardware({ cores: 4, memory: 8 });
    expect(isLowEndDevice()).toBe(true);
  });

  it("treats 4 GB of memory as low-end", () => {
    setHardware({ cores: 8, memory: 4 });
    expect(isLowEndDevice()).toBe(true);
  });

  it("leaves a capable machine alone", () => {
    setHardware({ cores: 8, memory: 8 });
    expect(isLowEndDevice()).toBe(false);
  });

  it("counts unreported memory as capable, so Safari and Firefox keep every effect", () => {
    setHardware({ cores: 10, memory: undefined });
    expect(isLowEndDevice()).toBe(false);
  });

  it("marks <html> for CSS only on low-end machines", () => {
    setHardware({ cores: 8, memory: 8 });
    initPerfMode();
    expect(document.documentElement.getAttribute("data-perf")).toBeNull();

    setHardware({ cores: 2, memory: 8 });
    initPerfMode();
    expect(document.documentElement.getAttribute("data-perf")).toBe("low");
  });

  it("can be marked later, when scrolling runs slow", () => {
    markLowEnd();
    expect(document.documentElement.getAttribute("data-perf")).toBe("low");
  });
});
