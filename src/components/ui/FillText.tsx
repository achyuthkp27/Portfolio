import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { Fragment, useRef, type ElementType } from "react";

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
    <motion.span style={{ opacity }} className="inline-block">
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
      {/* Real spaces between the words, so copy, find-in-page and screen readers read whole words */}
      <Tag className={className}>
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <Word word={w} index={i} total={words.length} progress={scrollYProgress} />
          </Fragment>
        ))}
      </Tag>
    </div>
  );
};

export default FillText;
