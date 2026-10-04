/** Small shared helpers for the scroll choreography and the dated lists. */

/** Clamps a progress value to 0–1 */
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Two-digit index or time part: 3 → "03" */
export const pad2 = (n: number) => String(n).padStart(2, "0");

/** "24 Sept": a day and short month, for push and commit dates */
export const monthDay = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

/** "Sept 2026": read in UTC so a date-only string never slips into the previous month */
export const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
