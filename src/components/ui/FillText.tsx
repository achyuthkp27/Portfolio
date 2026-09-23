import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ElementType } from "react";

const Word = ({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.22, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.28em]">
      {word}
    </motion.span>
  );
};

interface FillTextProps {
  text: string;
  className?: string;
  as?: ElementType;
  /** Scroll offsets: when the fill starts and ends relative to the viewport */
  offset?: [string, string];
}

/**
 * Text that fills in word by word as the reading line passes it, the way majd's manifesto
 * fills on scroll. One component so the technique reads the same wherever it appears.
 */
export const FillText = ({
  text,
  className = "",
  as: Tag = "p",
  offset = ["start 0.85", "end 0.45"],
}: FillTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { scrollYProgress } = useScroll({ target: ref, offset: offset as any });
  const words = text.split(" ");
  return (
    <div ref={ref} className="relative" data-no-split>
      <Tag className={className} aria-label={text}>
        {words.map((w, i) => (
          <Word key={i} word={w} index={i} total={words.length} progress={scrollYProgress} />
        ))}
      </Tag>
    </div>
  );
};

export default FillText;
