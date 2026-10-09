import { act, render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from "vitest";
import { isChunkLoadError, reloadOnce, registerPreloadErrorReload } from "../ErrorBoundary";
import { LazySection } from "../ui/LazySection";
import notFoundHtml from "../../../public/404.html?raw";

describe("isChunkLoadError", () => {
  it.each([
    "Failed to fetch dynamically imported module: https://x/assets/About-abc.js",
    "error loading dynamically imported module: https://x/assets/About-abc.js",
    "Importing a module script failed.",
    "Unable to preload CSS for https://x/assets/About-abc.css",
    "Loading chunk 12 failed.",
    "Loading CSS chunk 3 failed.",
    "Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of text/html",
  ])("detects %s", (message) => {
    expect(isChunkLoadError(new Error(message))).toBe(true);
    expect(isChunkLoadError(new TypeError(message))).toBe(true);
  });

  it("detects a ChunkLoadError by name", () => {
    const error = new Error("whatever");
    error.name = "ChunkLoadError";
    expect(isChunkLoadError(error)).toBe(true);
  });

  it.each([new Error("Cannot read properties of undefined"), null, undefined, 42, {}])("ignores %s", (error) => {
    expect(isChunkLoadError(error)).toBe(false);
  });
});

describe("reloadOnce", () => {
  // With site data blocked, Chrome throws on merely reading window.sessionStorage
  const blockStorage = () =>
    vi.spyOn(window, "sessionStorage", "get").mockImplementation(() => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    });

  // Each test starts well clear of the last one's reload, so the module's in-memory guard doesn't carry over
  let clock = new Date("2026-01-01T00:00:00Z").getTime();
  const advance = (ms: number) => {
    clock += ms;
    vi.setSystemTime(clock);
  };

  beforeAll(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(clock);
  });
  afterAll(() => vi.useRealTimers());
  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
    window.name = "";
    advance(60_000);
  });

  it("reloads once, then not again within 10 seconds, then again after", () => {
    const reload = vi.fn();
    expect(reloadOnce(reload)).toBe(true);
    advance(5_000);
    expect(reloadOnce(reload)).toBe(false);
    advance(5_000);
    expect(reloadOnce(reload)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
    advance(1);
    expect(reloadOnce(reload)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("remembers the reload in sessionStorage, so the reloaded page doesn't reload again", () => {
    const reload = vi.fn();
    reloadOnce(reload);
    expect(sessionStorage.getItem("last-error-reload")).toBe(String(clock));
  });

  it("does not throw when sessionStorage is blocked, and still reloads only once", () => {
    blockStorage();
    const reload = vi.fn();
    expect(() => reloadOnce(reload)).not.toThrow();
    expect(reload).toHaveBeenCalledTimes(1);
    expect(window.name).toBe(`error-reload:${clock}`);
    advance(3_000);
    expect(reloadOnce(reload)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("with storage blocked, does not reload when window.name already belongs to something else", () => {
    blockStorage();
    window.name = "someone-elses";
    const reload = vi.fn();
    expect(reloadOnce(reload)).toBe(false);
    expect(reload).not.toHaveBeenCalled();
    expect(window.name).toBe("someone-elses");
  });

  it("registerPreloadErrorReload cancels the preload error only when it reloads", () => {
    const stop = registerPreloadErrorReload();
    const fire = () => {
      const event = new Event("vite:preloadError", { cancelable: true });
      window.dispatchEvent(event);
      return event.defaultPrevented;
    };
    // jsdom logs "not implemented" for location.reload; keep it out of the test output
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(fire()).toBe(true);
    // jsdom can't navigate, so check the guard's own record of the reload
    expect(sessionStorage.getItem("last-error-reload")).toBe(String(clock));
    advance(1_000);
    expect(fire()).toBe(false);
    stop();
    advance(60_000);
    expect(fire()).toBe(false);
    consoleError.mockRestore();
  });
});

describe("LazySection error boundary", () => {
  const originalError = console.error;
  const swallow = (e: ErrorEvent) => e.preventDefault();
  beforeAll(() => {
    console.error = vi.fn();
    window.addEventListener("error", swallow);
  });
  afterAll(() => {
    console.error = originalError;
    window.removeEventListener("error", swallow);
  });

  afterEach(() => vi.useRealTimers());

  const Broken = (): never => {
    throw new Error("Section exploded");
  };

  it("renders nothing for a section that throws, keeps its placeholder height, and leaves its sibling alone", () => {
    vi.useFakeTimers();
    const { container } = render(
      <main>
        <LazySection sectionId="broken">
          <Broken />
        </LazySection>
        <LazySection>
          <p>Sibling content</p>
        </LazySection>
      </main>,
    );
    // The test IntersectionObserver never fires, so let the idle timer mount both sections
    act(() => vi.advanceTimersByTime(5_000));
    expect(screen.getByText("Sibling content")).toBeInTheDocument();
    expect(screen.queryByText(/exploded/)).toBeNull();
    const placeholder = container.querySelector("#broken");
    expect(placeholder).not.toBeNull();
    expect(placeholder).toBeEmptyDOMElement();
    expect(placeholder!.className).toContain("min-h-[var(--mh-sm)]");
  });
});

describe("404.html redirect", () => {
  const script = notFoundHtml.match(/<script>([\s\S]*?)<\/script>/)![1];
  const mapped = (pathname: string, search = "", hash = "") => {
    const replace = vi.fn();
    const fakeWindow = { location: { pathname, search, hash, replace } };
    new Function("window", script)(fakeWindow);
    expect(replace).toHaveBeenCalledTimes(1);
    return replace.mock.calls[0][0] as string;
  };

  it.each([
    ["/Portfolio/project/VoxOs", "", "", "/Portfolio/#/project/VoxOs"],
    ["/Portfolio/project/voxos", "?x=1", "", "/Portfolio/#/project/voxos?x=1"],
    ["/Portfolio/project/VoxOs/", "", "#readme", "/Portfolio/#/project/VoxOs"],
    ["/Portfolio/foo/bar", "", "", "/Portfolio/#/foo/bar"],
    ["/Portfolio/", "", "", "/Portfolio/"],
    ["/Portfolio/index.html", "", "", "/Portfolio/"],
    ["/other", "", "", "/Portfolio/"],
    ["/", "?x=1", "", "/Portfolio/"],
  ])("%s%s%s -> %s", (pathname, search, hash, expected) => {
    expect(mapped(pathname, search, hash)).toBe(expected);
  });
});
