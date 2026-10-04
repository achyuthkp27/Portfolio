import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * One key visual per work card: a single large object in the stage, set in the site's
 * type, with the accent doing the lighting. Nothing here pretends to be a live tool.
 */

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } };
const rise = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const Stage = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div
    variants={stagger}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-10%" }}
    className={`absolute inset-0 flex flex-col items-center justify-center text-snow ${className}`}
  >
    {children}
  </motion.div>
);
const Caption = ({ children, sub }: { children: ReactNode; sub?: ReactNode }) => (
  <motion.div variants={rise} className="text-center">
    <p className="t-heading text-2xl md:text-3xl">{children}</p>
    {sub && <p className="t-figure text-[10px] text-muted mt-1.5 tracking-[0.2em] uppercase">{sub}</p>}
  </motion.div>
);

/* 06 — Assistant: three bubbles at reading size, the gate between them */
export const ChatScreen = () => (
  <Stage className="px-6 md:px-14">
    <div className="w-full max-w-xl flex flex-col gap-3 font-body text-sm md:text-base">
      <motion.p variants={rise} className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-snow text-night px-5 py-3">
        What's my account balance?
      </motion.p>
      <motion.p
        variants={rise}
        className="self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-snow/[0.08] border border-line px-5 py-3"
      >
        First, the code we just sent you.
      </motion.p>
      <motion.span
        variants={rise}
        className="self-center flex items-center gap-2 rounded-pill border border-emerald-400/40 px-3 py-1 t-figure text-[11px] text-emerald-300"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> identity verified
      </motion.span>
      <motion.p
        variants={rise}
        className="self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-snow/[0.08] border border-line px-5 py-3"
      >
        Your current account ends in 4471. Want the last five transactions?
      </motion.p>
      <motion.span variants={rise} className="self-start ml-2 flex gap-1 py-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-snow/50 typing-dot" />
        <span className="h-1.5 w-1.5 rounded-full bg-snow/50 typing-dot [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-snow/50 typing-dot [animation-delay:300ms]" />
      </motion.span>
    </div>
  </Stage>
);

/* 08 — VoxOs: the waveform across the whole stage, the sentence beneath */
const BARS = Array.from(
  { length: 48 },
  (_, i) => 20 + Math.round(70 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21))),
);
export const VoxScreen = () => (
  <Stage className="px-6 md:px-14">
    <motion.div
      variants={rise}
      className="flex items-end justify-center gap-[3px] md:gap-1 h-24 md:h-32 w-full max-w-2xl"
    >
      {BARS.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-pill bg-emerald-400/85 vox-bar"
          style={{ height: `${h}%`, animationDelay: `${(i % 12) * 80}ms` }}
        />
      ))}
    </motion.div>
    <motion.p
      variants={rise}
      className="mt-5 md:mt-6 font-body font-semibold text-lg md:text-2xl text-center max-w-xl text-balance"
    >
      "Open the billing pull request and run the tests."
    </motion.p>
    <div className="mt-4">
      <Caption sub="Swift · macOS · nothing leaves the Mac">Said. Done.</Caption>
    </div>
  </Stage>
);
