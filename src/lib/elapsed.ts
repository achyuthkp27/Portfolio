const IST_MS = 5.5 * 3600000;

export interface Elapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Days in a month. Month is zero-based and may overflow. */
const daysInMonth = (year: number, month: number) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

/**
 * Time from start to now, counted on the Bengaluru calendar so it reads the same for every visitor.
 * Returns all zeros when now is before start.
 */
export const elapsedSince = (start: Date, now: Date): Elapsed => {
  const diff = now.getTime() - start.getTime();
  if (!(diff > 0)) return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const n = new Date(now.getTime() + IST_MS);
  const s = new Date(start.getTime() + IST_MS);
  let years = n.getUTCFullYear() - s.getUTCFullYear();
  let months = n.getUTCMonth() - s.getUTCMonth();
  let days = n.getUTCDate() - s.getUTCDate();
  if (days < 0) {
    // Borrow the month before now. A start day it lacks counts as its last day.
    months -= 1;
    const prevLen = daysInMonth(n.getUTCFullYear(), n.getUTCMonth() - 1);
    days = n.getUTCDate() + prevLen - Math.min(s.getUTCDate(), prevLen);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return {
    years,
    months,
    days,
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
};
