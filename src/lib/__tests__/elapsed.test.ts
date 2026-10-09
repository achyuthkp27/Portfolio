import { describe, it, expect } from "vitest";
import { elapsedSince } from "../elapsed";

// Midnight on the Bengaluru calendar.
const ist = (d: string, time = "00:00:00") => new Date(`${d}T${time}+05:30`);
const ymd = (start: Date, now: Date) => {
  const { years, months, days } = elapsedSince(start, now);
  return [years, months, days];
};

describe("elapsedSince", () => {
  it("Jan 31 to Mar 1, non-leap year: 1m 1d", () => {
    expect(ymd(ist("2025-01-31"), ist("2025-03-01"))).toEqual([0, 1, 1]);
  });
  it("Jan 31 to Mar 1, leap year: 1m 1d", () => {
    expect(ymd(ist("2024-01-31"), ist("2024-03-01"))).toEqual([0, 1, 1]);
  });
  it("Jan 30 to Mar 1, non-leap year: 1m 1d", () => {
    expect(ymd(ist("2025-01-30"), ist("2025-03-01"))).toEqual([0, 1, 1]);
  });
  it("Feb 29 2024 to Feb 28 2025: 11m 30d", () => {
    expect(ymd(ist("2024-02-29"), ist("2025-02-28"))).toEqual([0, 11, 30]);
  });
  it("Feb 29 2024 to Mar 1 2025: 1y 0m 1d", () => {
    expect(ymd(ist("2024-02-29"), ist("2025-03-01"))).toEqual([1, 0, 1]);
  });

  const career = ist("2021-07-26");
  it("career start to 9 Oct 2026 noon: 5y 2m 13d 12:00:00", () => {
    expect(elapsedSince(career, ist("2026-10-09", "12:00:00"))).toEqual({
      years: 5,
      months: 2,
      days: 13,
      hours: 12,
      minutes: 0,
      seconds: 0,
    });
  });
  it("career start to 25 Jul 2022: 0y 11m 29d", () => {
    expect(ymd(career, ist("2022-07-25"))).toEqual([0, 11, 29]);
  });
  it("career start to 1 Mar 2024: 2y 7m 4d", () => {
    expect(ymd(career, ist("2024-03-01"))).toEqual([2, 7, 4]);
  });
  it("career start to 26 Jul 2026 05:04:03: exactly 5y, 05:04:03", () => {
    expect(elapsedSince(career, ist("2026-07-26", "05:04:03"))).toEqual({
      years: 5,
      months: 0,
      days: 0,
      hours: 5,
      minutes: 4,
      seconds: 3,
    });
  });

  it("same instant is all zeros", () => {
    expect(elapsedSince(career, career)).toEqual({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
  it("now before start is all zeros", () => {
    expect(elapsedSince(career, ist("2020-01-01"))).toEqual({
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it("never yields negative days or 12+ months over a sweep", () => {
    const start = ist("2023-01-31");
    for (let i = 0; i < 1200; i++) {
      const e = elapsedSince(start, new Date(start.getTime() + i * 86400000 + 3600000));
      expect(e.days).toBeGreaterThanOrEqual(0);
      expect(e.months).toBeGreaterThanOrEqual(0);
      expect(e.months).toBeLessThan(12);
    }
  });
});
