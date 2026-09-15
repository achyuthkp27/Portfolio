/**
 * Guards the protected opening splash screen (see CLAUDE.md).
 * If one of these fails, restore the splash screen. Do not delete the test.
 */
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import PremiumLoader from "../PremiumLoader";
import { LOADER_WORDS } from "@/data/loader";
import { LoadingProvider, useLoading } from "@/context/LoadingContext";

const LoadingProbe = () => {
  const { isLoading } = useLoading();
  return <span data-testid="loading-state">{String(isLoading)}</span>;
};

const renderLoader = () =>
  render(
    <LoadingProvider>
      <PremiumLoader />
      <LoadingProbe />
    </LoadingProvider>,
  );

const setEnvironment = ({ width, reducedMotion }: { width: number; reducedMotion: boolean }) => {
  Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: width });
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches:
      (query.includes("prefers-reduced-motion") && reducedMotion) ||
      (query.includes("max-width") && width < 768),
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe("PremiumLoader (protected splash screen)", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it.each([
    { name: "desktop", width: 1440, reducedMotion: false },
    { name: "phone", width: 390, reducedMotion: false },
    { name: "reduced motion", width: 1440, reducedMotion: true },
    { name: "phone with reduced motion", width: 390, reducedMotion: true },
  ])("shows on $name", ({ width, reducedMotion }) => {
    setEnvironment({ width, reducedMotion });
    renderLoader();
    act(() => vi.advanceTimersByTime(50));

    expect(screen.getByTestId("splash-screen")).toBeInTheDocument();
    expect(screen.getByTestId("loading-state")).toHaveTextContent("true");
  });

  it("flips through the words and ends on the name", () => {
    setEnvironment({ width: 1440, reducedMotion: false });
    renderLoader();
    expect(screen.getByText(LOADER_WORDS[0])).toBeInTheDocument();
    expect(LOADER_WORDS[LOADER_WORDS.length - 1]).toBe("Achyuth KP");
  });

  it("always releases the page so the site is never stuck behind it", () => {
    setEnvironment({ width: 390, reducedMotion: false });
    renderLoader();
    act(() => vi.advanceTimersByTime(4100));
    expect(screen.getByTestId("loading-state")).toHaveTextContent("false");
  });

  it("is still mounted by the app shell", () => {
    const app = readFileSync(resolve(__dirname, "../../App.tsx"), "utf8");
    expect(app).toMatch(/import PremiumLoader from "@\/components\/PremiumLoader"/);
    expect(app).toMatch(/<PremiumLoader\s*\/>/);
  });
});
