import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMobile } from "../useMobile";

describe("useMobile", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false for desktop viewport", () => {
    // Default matchMedia mock returns matches: false (desktop)
    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });

    const { result } = renderHook(() => useMobile());

    expect(result.current).toBe(false);
  });

  it("returns true for mobile viewport", () => {
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });

    const { result } = renderHook(() => useMobile());

    expect(result.current).toBe(true);
  });

  it("responds to resize events", async () => {
    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });

    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(false);

    // Simulate resize to mobile
    await act(async () => {
      Object.defineProperty(window, "innerWidth", { value: 375, writable: true });
      window.dispatchEvent(new Event("resize"));
      // Wait for debounce (100ms in the hook)
      await new Promise((r) => setTimeout(r, 150));
    });

    expect(result.current).toBe(true);
  });
});
