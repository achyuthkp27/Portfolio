/**
 * A frosted band fixed to the bottom of the viewport, after neiden.framer.media: whatever
 * scrolls under it softens and fades, so the page always ends in glass rather than a
 * hard edge. Pointer events pass through; nothing sits inside it.
 */
export const GlassEdge = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 md:h-32 backdrop-blur-xl [mask-image:linear-gradient(to_top,black_25%,transparent)] [-webkit-mask-image:linear-gradient(to_top,black_25%,transparent)]"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
  </div>
);

export default GlassEdge;
