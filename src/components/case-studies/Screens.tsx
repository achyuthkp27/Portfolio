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
    <p className="t-heading text-3xl md:text-4xl lg:text-5xl">{children}</p>
    {sub && <p className="t-figure text-[11px] text-muted mt-2 tracking-[0.2em] uppercase">{sub}</p>}
  </motion.div>
);

/* 01 — Platform: three channels feeding one bus, thirty services drawing from it */
const CHANNELS = ["Retail", "Mobile", "Corporate"];
export const PlatformScreen = () => (
  <Stage className="px-6 md:px-14">
    <div className="w-full max-w-2xl flex flex-col items-stretch">
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {CHANNELS.map((c) => (
          <motion.span
            key={c}
            variants={rise}
            className="t-heading text-lg md:text-2xl text-center rounded-md border border-snow/15 bg-night/70 py-3 md:py-4"
          >
            {c}
          </motion.span>
        ))}
      </div>
      <motion.svg variants={rise} viewBox="0 0 600 60" className="w-full h-10 md:h-14" aria-hidden="true">
        {[100, 300, 500].map((x) => (
          <path
            key={x}
            d={`M ${x} 0 C ${x} 30, 300 30, 300 60`}
            fill="none"
            stroke="hsl(153 60% 62% / 0.6)"
            strokeWidth="1.5"
          />
        ))}
      </motion.svg>
      <motion.div
        variants={rise}
        className="relative rounded-md border border-emerald-400/60 bg-emerald-500/[0.08] py-3 md:py-4 text-center t-figure text-[11px] md:text-xs tracking-[0.3em] uppercase text-emerald-300 shadow-[0_0_40px_-10px_hsl(153_60%_50%/0.6)]"
      >
        <span className="absolute inset-0 bus-flow rounded-md" aria-hidden="true" />
        <span className="relative">Kafka event bus</span>
      </motion.div>
      <motion.div variants={rise} className="mt-4 md:mt-6 grid grid-cols-10 gap-1.5 md:gap-2" aria-hidden="true">
        {Array.from({ length: 30 }, (_, i) => (
          <span
            key={i}
            className="h-2.5 md:h-3 rounded-[3px] bg-snow/[0.14] svc-pip"
            style={{ animationDelay: `${(i * 137) % 2400}ms` }}
          />
        ))}
      </motion.div>
    </div>
    <div className="mt-6 md:mt-8">
      <Caption sub="Spring Boot · PostgreSQL · Redis">30+ services. One platform.</Caption>
    </div>
  </Stage>
);

/* 04 — Card on file: one card, the number giving way to a token */
export const TokenScreen = () => (
  <Stage>
    <motion.div
      variants={rise}
      whileHover={{ rotateX: -6, rotateY: 8 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="relative w-[78%] max-w-[420px] aspect-[1.586] rounded-lg border border-snow/20 p-5 md:p-7 flex flex-col justify-between shadow-[0_50px_80px_-30px_rgba(0,0,0,0.95)] [transform-style:preserve-3d]"
      style={{
        background: "linear-gradient(135deg, hsl(200 6% 18%) 0%, hsl(200 8% 8%) 55%, hsl(153 30% 12%) 100%)",
      }}
    >
      <div className="absolute inset-0 rounded-lg pointer-events-none trophy-gloss" />
      <div className="flex items-center justify-between">
        <span className="h-7 w-10 md:h-8 md:w-12 rounded-[4px] bg-gradient-to-br from-amber-200/80 to-amber-500/60" />
        <span className="t-figure text-[10px] text-snow/50 tracking-[0.3em]">CARD ON FILE</span>
      </div>
      <div>
        <p className="font-mono text-lg md:text-2xl tracking-[0.16em] text-snow/35 line-through decoration-emerald-400/80 decoration-2">
          5412 7534 9821 0067
        </p>
        <p className="font-mono text-lg md:text-2xl tracking-[0.12em] text-emerald-300 mt-1">tok_9f3a2c…e71c</p>
      </div>
      <div className="flex items-center justify-between t-figure text-[11px] text-snow/60">
        <span>never touches disk</span>
        <span>MC · VISA</span>
      </div>
    </motion.div>
    <div className="absolute inset-x-0 bottom-6 md:bottom-8">
      <Caption sub="JWE · JWS · network tokens">The number leaves. The token stays.</Caption>
    </div>
  </Stage>
);

/* 05 — Video KYC: a scanning ring around the face */
export const KycScreen = () => (
  <Stage>
    <motion.div variants={rise} className="relative h-[200px] w-[200px] md:h-[250px] md:w-[250px]">
      <span aria-hidden="true" className="absolute inset-0 rounded-full border border-snow/15" />
      <span aria-hidden="true" className="absolute inset-0 rounded-full kyc-ring" />
      <span aria-hidden="true" className="absolute inset-[14%] rounded-full bg-snow/[0.05] border border-snow/10" />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[30%] -translate-x-1/2 h-[24%] aspect-square rounded-full bg-snow/[0.12]"
      />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[56%] -translate-x-1/2 h-[30%] w-[46%] rounded-t-[50%] bg-snow/[0.09]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-[14%] h-px bg-emerald-400/80 shadow-[0_0_12px_hsl(153_60%_62%)] kyc-scan"
      />
    </motion.div>
    <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-2">
      {["ID captured", "Liveness", "Face match"].map((c) => (
        <motion.span
          key={c}
          variants={rise}
          className="flex items-center gap-2 rounded-pill border border-emerald-400/40 px-3 py-1 t-figure text-[11px] text-emerald-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {c}
        </motion.span>
      ))}
    </div>
    <div className="mt-5">
      <Caption sub="WebRTC · WebSockets">Verified on camera.</Caption>
    </div>
  </Stage>
);

/* 06 — Assistant: three bubbles at reading size, the gate between them */
export const ChatScreen = () => (
  <Stage className="px-6 md:px-14">
    <div className="w-full max-w-xl flex flex-col gap-3 font-body text-[15px] md:text-lg">
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
      className="relative w-full max-w-xl rounded-md border border-snow/20 bg-night/90 backdrop-blur px-5 py-4 font-mono text-base md:text-xl flex items-center gap-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]"
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
      className="mt-6 md:mt-8 font-body font-semibold text-xl md:text-3xl text-center max-w-xl text-balance"
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
