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

/* 07 — Observability: one search bar over a stream of every service's lines */
const LINES = [
  "svc-payments  transfer accepted",
  "svc-auth      maker-checker pending",
  "svc-cards     limit check ok",
  "svc-auth      approval granted",
  "svc-payments  transfer released",
  "svc-audit     event stored",
  "svc-kyc       session opened",
  "svc-notify    push delivered",
  "svc-ledger    posting committed",
  "svc-fx        rate fetched",
];
export const LogScreen = () => (
  <Stage className="px-6 md:px-14">
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
    >
      <div className="log-stream font-mono text-[11px] md:text-xs text-snow/30 leading-7 whitespace-pre px-6 md:px-14">
        {[...LINES, ...LINES].map((l, i) => (
          <div key={i}>
            <span className="text-snow/20">
              12:04:3{i % 10}.{String((i * 137) % 1000).padStart(3, "0")}{" "}
            </span>
            {l}
          </div>
        ))}
      </div>
    </div>
    <motion.div
      variants={rise}
      className="relative w-full max-w-xl rounded-md border border-snow/20 bg-night/90 backdrop-blur px-4 py-3 font-mono text-sm md:text-base flex items-center gap-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
    >
      <span className="text-muted">⌕</span>
      <span>
        trace_id:<span className="text-emerald-300">9f3a2c1e</span>
      </span>
      <span className="ml-auto t-figure text-[11px] text-muted">6 hits · 4 services</span>
    </motion.div>
    <div className="relative mt-6">
      <Caption sub="Logstash · Elasticsearch · Kibana · Kafka">Every log. One search bar.</Caption>
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

/* 09 — Kairo: the phone, lit from within */
export const KairoScreen = () => (
  <Stage>
    <motion.div
      variants={rise}
      className="relative h-[280px] w-[140px] md:h-[340px] md:w-[170px] rounded-[2rem] border-2 border-snow/25 bg-night shadow-[0_0_80px_-10px_hsl(153_60%_50%/0.45),0_40px_60px_-30px_rgba(0,0,0,0.9)] p-3 flex flex-col"
    >
      <span aria-hidden="true" className="mx-auto h-1.5 w-12 rounded-pill bg-snow/20" />
      <div className="mt-6 flex-1 flex flex-col gap-2 font-body text-[11px] md:text-xs">
        <span className="self-end rounded-xl rounded-br-sm bg-snow text-night px-2.5 py-1.5">
          Anything odd this month?
        </span>
        <span className="self-start rounded-xl rounded-bl-sm bg-snow/[0.1] px-2.5 py-1.5">
          A merchant charged you twice within a minute.
        </span>
        <span className="self-start rounded-xl rounded-bl-sm bg-snow/[0.1] px-2.5 py-1.5">Draft a dispute?</span>
      </div>
      <span className="flex items-center justify-center gap-1.5 t-figure text-[9px] text-emerald-300 uppercase tracking-[0.2em]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> on device
      </span>
    </motion.div>
    <div className="mt-6">
      <Caption sub="Qwen on the phone · airplane mode works">Nothing leaves the phone.</Caption>
    </div>
  </Stage>
);
