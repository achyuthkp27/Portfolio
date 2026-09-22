import { useEffect, useState } from "react";

/** Wall-clock time in a time zone, ticking each minute. Honest and cheap. */
export function useLocalTime(timeZone: string) {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(
      new Date(),
    );
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}
