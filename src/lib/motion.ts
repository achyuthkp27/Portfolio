/**
 * The site's whole motion vocabulary. Three durations, one ease, one reveal.
 * Anything that moves uses these; nothing else fades or slides on its own terms.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  fast: 0.2,
  base: 0.4,
  slow: 0.8,
} as const;

/**
 * The one entrance used for content: a short rise into place, once, when it nears the
 * viewport. Reserved for things being drawn or posted, not for every paragraph.
 */
export const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: DUR.base, ease: EASE, delay },
});
