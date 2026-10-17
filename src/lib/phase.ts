import { clamp01 } from "./format";

/** Smoothstep on 0–1 */
export const ease = (t: number) => t * t * (3 - 2 * t);

/** 0 → 1 as v runs from a to b, eased: one step of a scroll-driven scene */
export const phase = (v: number, a: number, b: number) => ease(clamp01((v - a) / (b - a)));
