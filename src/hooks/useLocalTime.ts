import { useEffect, useState } from "react";

/** Wall-clock time in a time zone, 12-hour, ticking each minute. Honest and cheap. */
export function useLocalTime(timeZone: string) {
  const format = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    }).formatToParts(new Date());
    const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
    return { time: `${get("hour")}:${get("minute")}`, period: get("dayPeriod").toUpperCase() };
  };
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}
