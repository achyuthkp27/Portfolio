import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { StrictMode } from "react";
import { createPageviewTracker } from "../analyticsPageviews";

const posthogMock = vi.hoisted(() => ({ init: vi.fn(), capture: vi.fn() }));
vi.mock("posthog-js", () => ({ default: posthogMock }));

describe("createPageviewTracker", () => {
  it("sends one pageview per pathname and ignores repeats", () => {
    const client = { capture: vi.fn() };
    const track = createPageviewTracker(client);
    expect(track("/", "https://x.test/#/")).toBe(true);
    expect(track("/", "https://x.test/#/")).toBe(false);
    expect(track("/project/a", "https://x.test/#/project/a")).toBe(true);
    expect(track("/", "https://x.test/#/")).toBe(true);
    expect(client.capture).toHaveBeenCalledTimes(3);
    expect(client.capture).toHaveBeenNthCalledWith(1, "$pageview", {
      $current_url: "https://x.test/#/",
      $pathname: "/",
    });
  });
});

describe("<Analytics />", () => {
  let navigate: ReturnType<typeof useNavigate>;
  const Nav = () => {
    navigate = useNavigate();
    return null;
  };

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("VITE_POSTHOG_KEY", "phc_test");
    posthogMock.init.mockClear();
    posthogMock.capture.mockClear();
  });

  const pageviews = () => posthogMock.capture.mock.calls.filter(([event]) => event === "$pageview");

  it("sends the landing pageview once on init and one per route change", async () => {
    const { default: Analytics } = await import("@/components/Analytics");
    const ui = (
      <StrictMode>
        <MemoryRouter initialEntries={["/"]}>
          <Nav />
          <Analytics />
        </MemoryRouter>
      </StrictMode>
    );
    const { rerender } = render(ui);
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(posthogMock.init).toHaveBeenCalledTimes(1);
    expect(posthogMock.init.mock.calls[0][1]).toMatchObject({
      persistence: "memory",
      respect_dnt: true,
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
    });
    expect(pageviews()).toHaveLength(1);
    expect(pageviews()[0][1]).toMatchObject({ $pathname: "/" });

    // Re-render: no duplicate
    rerender(ui);
    expect(pageviews()).toHaveLength(1);

    act(() => navigate("/project/voxos"));
    expect(pageviews()).toHaveLength(2);
    expect(pageviews()[1][1]).toMatchObject({ $pathname: "/project/voxos" });

    // Back home, then a query-only replace (Open source's ?scrollTo cleanup) is not a new page
    act(() => navigate("/?scrollTo=voxos"));
    act(() => navigate({ search: "" }, { replace: true }));
    expect(pageviews()).toHaveLength(3);
    expect(pageviews()[2][1]).toMatchObject({ $pathname: "/" });
  });

  it("does nothing without a key", async () => {
    vi.stubEnv("VITE_POSTHOG_KEY", "");
    const { default: Analytics } = await import("@/components/Analytics");
    render(
      <MemoryRouter>
        <Analytics />
      </MemoryRouter>,
    );
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(posthogMock.init).not.toHaveBeenCalled();
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });
});
