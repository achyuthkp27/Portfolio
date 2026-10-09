import { describe, expect, it } from "vitest";
import { judgeFrames } from "../SmoothScroll";

const windowOf = (count: number, ms: number) => Array.from({ length: count }, () => ms);

describe("judgeFrames", () => {
  it("passes a smooth 60fps window", () => {
    expect(judgeFrames(windowOf(90, 16.7), false)).toEqual({ slow: false, dropped: false });
  });

  it("trips at once when the median frame runs slow", () => {
    expect(judgeFrames(windowOf(90, 30), false).slow).toBe(true);
  });

  it("trips on bursty dropped frames only in the second window in a row", () => {
    // 25% of frames at 40ms, the rest at a steady 16ms: the median alone would pass this
    const bursty = [...windowOf(23, 40), ...windowOf(67, 16)];

    const first = judgeFrames(bursty, false);
    expect(first).toEqual({ slow: false, dropped: true });

    const second = judgeFrames(bursty, first.dropped);
    expect(second).toEqual({ slow: true, dropped: true });
  });

  it("forgives a bursty window followed by a smooth one", () => {
    const bursty = [...windowOf(23, 40), ...windowOf(67, 16)];
    const first = judgeFrames(bursty, false);
    const second = judgeFrames(windowOf(90, 16.7), first.dropped);
    expect(second).toEqual({ slow: false, dropped: false });
    expect(judgeFrames(bursty, second.dropped).slow).toBe(false);
  });

  it("ignores one long spike", () => {
    const spiked = [...windowOf(89, 16.7), 200];
    expect(judgeFrames(spiked, false)).toEqual({ slow: false, dropped: false });
    expect(judgeFrames(spiked, true).slow).toBe(false);
  });

  it("does not count frames just under the dropped threshold", () => {
    expect(judgeFrames(windowOf(90, 32), true).dropped).toBe(false);
  });

  it("does not mutate the frames it is given", () => {
    const frames = [40, 16, 30];
    judgeFrames(frames, false);
    expect(frames).toEqual([40, 16, 30]);
  });
});
