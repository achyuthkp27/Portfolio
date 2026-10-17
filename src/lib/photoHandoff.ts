export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** How far the hero photo has handed over to its particle twin, by hero scroll progress. */
export const photoHandoff = (v: number) => smoothstep(0.03, 0.14, v);
