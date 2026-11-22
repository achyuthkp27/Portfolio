/**
 * Which look the site wears while the two are compared: the reel-inspired one (pill nav, folder
 * cards, crowd footer) by default, or the original with `?look=classic` in the address, e.g.
 * http://localhost:5173/Portfolio/?look=classic. Read once per page load.
 */
export const CLASSIC_LOOK =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("look") === "classic";
