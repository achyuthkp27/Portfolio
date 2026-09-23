import { useEffect, useState } from "react";

/** Live answer to a CSS media query, correct from the first render. */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return matches;
};

export default useMediaQuery;
