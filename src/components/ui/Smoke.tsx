/**
 * Slow drifting smoke for a dark card, drawn in code: three soft blobs move on long
 * loops behind a turbulence-displaced layer, with grain on top. No video, no asset.
 * Reduced motion shows the blobs still.
 */
export const Smoke = ({ id = "smoke" }: { id?: string }) => (
  <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 600">
      <defs>
        <filter id={`${id}-warp`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009" numOctaves="3" seed="7" result="noise">
            <animate
              attributeName="baseFrequency"
              values="0.006 0.009;0.008 0.007;0.006 0.009"
              dur="28s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="90" xChannelSelector="R" yChannelSelector="G" />
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <radialGradient id={`${id}-g`}>
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="60%" stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={`url(#${id}-warp)`} opacity="0.55" className="motion-reduce:[animation:none]">
        <ellipse cx="140" cy="220" rx="150" ry="110" fill={`url(#${id}-g)`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;60 40;-30 20;0 0"
            dur="36s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="270" cy="330" rx="170" ry="120" fill={`url(#${id}-g)`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;-50 -30;30 -50;0 0"
            dur="42s"
            repeatCount="indefinite"
          />
        </ellipse>
        <ellipse cx="200" cy="120" rx="130" ry="90" fill={`url(#${id}-g)`}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0;30 60;-40 30;0 0"
            dur="31s"
            repeatCount="indefinite"
          />
        </ellipse>
      </g>
    </svg>
    <svg className="absolute inset-0 w-full h-full opacity-[0.07] mix-blend-screen">
      <filter id={`${id}-grain`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${id}-grain)`} />
    </svg>
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(0_0%_0%/0.6)_100%)]" />
  </div>
);

export default Smoke;
