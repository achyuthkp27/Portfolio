import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { useSectionScroll } from "../useSectionScroll";

const wrap =
  (initial: string) =>
  ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>;

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

describe("useSectionScroll", () => {
  beforeEach(() => {
    document.body.innerHTML = '<main><section id="about">About</section></main>';
    Element.prototype.scrollIntoView = vi.fn();
    window.scrollTo = vi.fn();
  });

  it("scrolls straight to the section when already on the home page", () => {
    const { result } = renderHook(() => useSectionScroll(), { wrapper: wrap("/") });
    act(() => result.current("about"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: expect.any(Number), behavior: "smooth" });
  });

  it("lands a data-scroll-end sequence on its last screen, not its start", () => {
    document.body.innerHTML = '<main><section id="contact" data-scroll-end>Contact</section></main>';
    const el = document.getElementById("contact")!;
    Object.defineProperty(el, "offsetHeight", { value: 3000 });
    el.getBoundingClientRect = () => ({ top: 500 }) as DOMRect;
    Object.defineProperty(window, "innerHeight", { value: 1000, configurable: true });
    const { result } = renderHook(() => useSectionScroll(), { wrapper: wrap("/") });
    act(() => result.current("contact"));
    // section top (500) plus everything but its last screen (3000 - 1000)
    expect(window.scrollTo).toHaveBeenCalledWith({ top: window.scrollY + 2500, behavior: "smooth" });
  });

  it("goes to the top for the 'top' id", () => {
    const { result } = renderHook(() => useSectionScroll(), { wrapper: wrap("/") });
    act(() => result.current("top"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("navigates home first from another route, then scrolls once the section exists", async () => {
    const { result } = renderHook(() => useSectionScroll(), { wrapper: wrap("/project/x") });
    act(() => result.current("about"));
    await act(async () => {
      await nextFrame();
      await nextFrame();
    });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: expect.any(Number), behavior: "smooth" });
  });
});
