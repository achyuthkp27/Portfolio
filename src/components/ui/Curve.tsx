/**
 * The curved seam between two sections, as the reference draws it: a wide shallow arc in
 * the colour of the section it belongs to, laid over the section before it. Set `fill`
 * to that section's background. `flip` bows the other way for a section's bottom edge.
 */
export const Curve = ({
  fill = "hsl(var(--graphite))",
  flip = false,
  className = "",
}: {
  fill?: string;
  flip?: boolean;
  className?: string;
}) => (
  <div aria-hidden="true" className={`relative w-full overflow-hidden leading-none ${className}`}>
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`block w-full h-[40px] md:h-[80px] lg:h-[110px] ${flip ? "rotate-180" : ""}`}
    >
      <path d="M0 120 C 360 0, 1080 0, 1440 120 Z" fill={fill} />
    </svg>
  </div>
);

export default Curve;
