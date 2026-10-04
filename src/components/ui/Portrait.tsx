/** The two portraits under public/images, each shipped as WebP with a JPEG fallback */
const SOURCES = {
  default: { name: "portrait", width: 593, height: 640 },
  belief: { name: "portrait-belief", width: 1024, height: 1536 },
} as const;

interface PortraitProps {
  variant?: keyof typeof SOURCES;
  /** Empty by default: most placements sit beside the name, so the photo is decorative */
  alt?: string;
  className?: string;
  pictureClassName?: string;
}

/** Lazy-loaded portrait photo */
export const Portrait = ({ variant = "default", alt = "", className, pictureClassName }: PortraitProps) => {
  const { name, width, height } = SOURCES[variant];
  const base = `${import.meta.env.BASE_URL}images/${name}`;
  return (
    <picture className={pictureClassName}>
      <source srcSet={`${base}.webp`} type="image/webp" />
      <img
        src={`${base}.jpg`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  );
};
