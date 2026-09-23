import { describe, it, expect, beforeEach } from "vitest";
import { isMotionOff, prefersReducedMotion, setMotionOff, initMotionPreference } from "../motionPreference";

describe("motion preference", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-motion");
  });

  it("is on by default and follows the switch", () => {
    expect(isMotionOff()).toBe(false);
    expect(prefersReducedMotion()).toBe(false);
    setMotionOff(true);
    expect(isMotionOff()).toBe(true);
    expect(prefersReducedMotion()).toBe(true);
    expect(document.documentElement.getAttribute("data-motion")).toBe("off");
    setMotionOff(false);
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
  });

  it("restores the stored choice at startup", () => {
    localStorage.setItem("motion", "off");
    initMotionPreference();
    expect(document.documentElement.getAttribute("data-motion")).toBe("off");
  });
});
