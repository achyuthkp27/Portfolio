import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useIdleMount } from "../useIdleMount";

describe("useIdleMount", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });

  it("returns false initially when shouldMount is true", () => {
    const { result } = renderHook(() => useIdleMount(true));

    expect(result.current).toBe(false);
  });

  it("returns false when shouldMount is false", () => {
    const { result } = renderHook(() => useIdleMount(false));

    expect(result.current).toBe(false);
  });

  it("mounts on user interaction (scroll)", () => {
    const { result } = renderHook(() => useIdleMount(true));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);
  });

  it("mounts on user interaction (mousemove)", () => {
    const { result } = renderHook(() => useIdleMount(true));

    act(() => {
      window.dispatchEvent(new Event("mousemove"));
    });

    expect(result.current).toBe(true);
  });

  it("mounts on user interaction (keydown)", () => {
    const { result } = renderHook(() => useIdleMount(true));

    act(() => {
      window.dispatchEvent(new Event("keydown"));
    });

    expect(result.current).toBe(true);
  });

  it("does not mount when shouldMount is false even with interaction", () => {
    const { result } = renderHook(() => useIdleMount(false));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(false);
  });

  it("stays true after mounting (doesn't reset)", () => {
    const { result } = renderHook(() => useIdleMount(true));

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current).toBe(true);

    // Simulate some time passing
    act(() => {
      vi.advanceTimersByTime(30000);
    });

    expect(result.current).toBe(true);
  });
});
