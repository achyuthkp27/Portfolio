import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Full-bleed product screens for the work cards: each one fills the stage the way a
 * real tool would, drawn in the site's type, with no invented numbers presented as
 * results (every figure here is illustrative UI chrome, not a claim).
 */

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } };
const rise = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Screen = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div
    variants={stagger}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-10%" }}
    className={`absolute inset-0 flex flex-col font-mono text-[11px] md:text-xs text-snow/85 ${className}`}
  >
    {children}
  </motion.div>
);
const Bar = ({ children }: { children: ReactNode }) => (
  <motion.div
    variants={rise}
    className="flex items-center justify-between gap-3 px-4 md:px-5 h-10 border-b border-line bg-night/40 shrink-0"
  >
    {children}
  </motion.div>
);
const Dot = ({ tone = "ok" }: { tone?: "ok" | "warn" | "off" }) => (
  <span
    className={`inline-block h-1.5 w-1.5 rounded-full ${tone === "ok" ? "bg-emerald-400" : tone === "warn" ? "bg-amber-300" : "bg-snow/30"}`}
  />
);
const Tag = ({ children, accent = false }: { children: ReactNode; accent?: boolean }) => (
  <span
    className={`rounded-sm px-1.5 py-0.5 text-[10px] ${accent ? "bg-emerald-400/15 text-emerald-300" : "bg-snow/[0.07] text-snow/70"}`}
  >
    {children}
  </span>
);

/* 01 — Corporate banking platform: a service map with three channels above */
const SERVICES = [
  ["accounts", "ok"],
  ["payments", "ok"],
  ["cards", "ok"],
  ["auth", "ok"],
  ["kyc", "ok"],
  ["notify", "warn"],
  ["ledger", "ok"],
  ["fx", "ok"],
  ["statements", "ok"],
  ["limits", "ok"],
  ["beneficiaries", "ok"],
  ["audit", "ok"],
] as const;
export const PlatformScreen = () => (
  <Screen>
    <Bar>
      <div className="flex items-center gap-2">
        {["Retail", "Mobile", "Corporate"].map((c, i) => (
          <span key={c} className={`px-2 py-0.5 rounded-sm ${i === 2 ? "bg-snow text-night" : "text-snow/60"}`}>
            {c}
          </span>
        ))}
      </div>
      <span className="text-muted">
        gateway <span className="text-snow/80">spring-boot</span> · bus <span className="text-emerald-300">kafka</span>
      </span>
    </Bar>
    <div className="flex-1 grid grid-cols-[1fr] md:grid-cols-[1fr_180px] min-h-0">
      <div className="p-4 md:p-5 grid grid-cols-3 md:grid-cols-4 gap-2 content-start">
        {SERVICES.map(([name, tone], i) => (
          <motion.div
            key={name}
            variants={rise}
            className="rounded-sm border border-line bg-night/60 px-2.5 py-2 flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-snow truncate-none break-words">svc-{name}</span>
              <Dot tone={tone} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted">
              <span>
                v{2 + (i % 3)}.{(i * 7) % 10}
              </span>
              <span>{(i * 37) % 3 === 0 ? "3" : "2"} pods</span>
            </div>
          </motion.div>
        ))}
        <motion.div
          variants={rise}
          className="col-span-3 md:col-span-4 rounded-sm border border-dashed border-emerald-400/50 bg-emerald-500/[0.06] px-3 py-2 flex items-center justify-between text-emerald-300 tracking-[0.2em] uppercase text-[10px]"
        >
          <span>Kafka event bus</span>
          <span className="normal-case tracking-normal text-emerald-300/80">30+ services · postgres · redis</span>
        </motion.div>
      </div>
      <motion.aside variants={rise} className="hidden md:flex flex-col border-l border-line p-4 gap-3 text-[10px]">
        <span className="text-muted uppercase tracking-[0.2em]">Topics</span>
        {["payments.initiated", "payments.approved", "cards.tokenised", "kyc.completed", "audit.events"].map((t) => (
          <span key={t} className="flex items-center gap-2 text-snow/75">
            <Dot /> {t}
          </span>
        ))}
        <span className="mt-auto text-muted">consumers rebalance ok</span>
      </motion.aside>
    </div>
  </Screen>
);

/* 04 — Card on file: the card, then the token that replaces it */
export const TokenScreen = () => (
  <Screen>
    <Bar>
      <span className="text-muted">card-on-file · tokenisation</span>
      <span className="flex items-center gap-2">
        <Tag accent>PCI scope: none</Tag>
        <Tag>MC · VISA</Tag>
      </span>
    </Bar>
    <div className="flex-1 grid md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 items-center">
      <motion.div
        variants={rise}
        className="relative aspect-[1.586] rounded-md border border-snow/20 bg-gradient-to-br from-[hsl(200_6%_16%)] to-[hsl(200_8%_6%)] p-4 md:p-5 flex flex-col justify-between shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center justify-between">
          <span className="h-6 w-8 rounded-sm bg-gradient-to-br from-amber-200/80 to-amber-500/60" />
          <span className="text-[10px] text-snow/60 tracking-[0.2em]">DEBIT</span>
        </div>
        <div>
          <p className="text-sm md:text-base tracking-[0.18em] text-snow/40 line-through decoration-emerald-400/70">
            5412 7534 9821 0067
          </p>
          <p className="mt-1 text-sm md:text-base tracking-[0.12em] text-emerald-300">tok_9f3a2c…e71c</p>
        </div>
        <div className="flex items-center justify-between text-[10px] text-snow/60">
          <span>A KP</span>
          <span>12/29</span>
        </div>
      </motion.div>
      <div className="flex flex-col gap-2">
        {[
          ["1", "PAN received over TLS", "never written to disk"],
          ["2", "Token vault issues surrogate", "JWE payload · JWS signed"],
          ["3", "Network token requested", "Mastercard · Visa"],
          ["4", "Merchant stores tok_…", "PAN out of scope"],
        ].map(([n, t, sub]) => (
          <motion.div
            key={n}
            variants={rise}
            className="flex items-center gap-3 rounded-sm border border-line bg-night/60 px-3 py-2"
          >
            <span className="h-5 w-5 rounded-full bg-snow/[0.08] text-[10px] flex items-center justify-center text-snow">
              {n}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-snow">{t}</span>
              <span className="block text-[10px] text-muted">{sub}</span>
            </span>
            <Dot />
          </motion.div>
        ))}
      </div>
    </div>
  </Screen>
);

/* 05 — Video KYC: two panes and the checklist */
const Face = ({ label }: { label: string }) => (
  <div className="relative flex-1 rounded-sm border border-line bg-night/70 overflow-hidden flex items-end p-2.5">
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-[22%] -translate-x-1/2 h-[26%] aspect-square rounded-full bg-snow/[0.08]"
    />
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-[52%] -translate-x-1/2 h-[40%] w-[52%] rounded-t-[50%] bg-snow/[0.06]"
    />
    <span aria-hidden="true" className="absolute inset-3 rounded-sm border border-emerald-400/40" />
    <span className="relative flex items-center gap-1.5 text-[10px] text-snow/80">
      <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" /> {label}
    </span>
  </div>
);
export const KycScreen = () => (
  <Screen>
    <Bar>
      <span className="text-muted">
        video-kyc · session <span className="text-snow/80">a1c9</span>
      </span>
      <span className="flex items-center gap-2">
        <Tag accent>WebRTC</Tag>
        <Tag>WebSocket signalling</Tag>
      </span>
    </Bar>
    <div className="flex-1 grid md:grid-cols-[1fr_200px] gap-3 p-3 md:p-4 min-h-0">
      <motion.div variants={rise} className="flex gap-3 min-h-[200px]">
        <Face label="customer · 00:42" />
        <Face label="agent" />
      </motion.div>
      <motion.div
        variants={rise}
        className="rounded-sm border border-line bg-night/60 p-3 flex flex-col gap-2 text-[10px]"
      >
        <span className="text-muted uppercase tracking-[0.2em]">Checks</span>
        {[
          ["ID document captured", "ok"],
          ["Liveness", "ok"],
          ["Face match", "ok"],
          ["Address proof", "warn"],
          ["Consent recorded", "ok"],
        ].map(([c, t]) => (
          <span key={c} className="flex items-center justify-between gap-2 text-snow/80">
            {c} <Dot tone={t as "ok" | "warn"} />
          </span>
        ))}
        <span className="mt-auto rounded-sm bg-emerald-400 text-night text-center py-1.5 font-medium">
          Open account
        </span>
      </motion.div>
    </div>
  </Screen>
);

/* 06 — LLM banking assistant: a chat with the identity gate visible */
const MSGS = [
  ["user", "What's my account balance?"],
  ["bot", "Before I look that up, confirm the code we just sent."],
  ["gate", "identity gate · TOTP verified"],
  ["user", "834 219"],
  ["bot", "Thanks. Your current account ends in 4471. Want the last five transactions too?"],
] as const;
export const ChatScreen = () => (
  <Screen>
    <Bar>
      <span className="text-muted">
        assistant · <span className="text-snow/80">spring-ai</span> · <span className="text-snow/80">langchain4j</span>
      </span>
      <Tag accent>tools: accounts · cards · payments</Tag>
    </Bar>
    <div className="flex-1 p-4 md:p-5 flex flex-col gap-2 justify-center min-h-0">
      {MSGS.map(([who, text], i) => (
        <motion.div
          key={i}
          variants={rise}
          className={
            who === "gate"
              ? "self-center text-[10px] text-emerald-300 border border-emerald-400/40 rounded-pill px-3 py-1"
              : who === "user"
                ? "self-end max-w-[78%] rounded-md rounded-br-none bg-snow text-night px-3 py-2"
                : "self-start max-w-[78%] rounded-md rounded-bl-none bg-snow/[0.08] border border-line px-3 py-2"
          }
        >
          {text}
        </motion.div>
      ))}
      <motion.div
        variants={rise}
        className="mt-2 flex items-center gap-2 rounded-sm border border-line bg-night/60 px-3 py-2 text-muted"
      >
        <span className="flex-1">Ask about your accounts…</span>
        <span className="h-5 w-5 rounded-sm bg-emerald-400" />
      </motion.div>
    </div>
  </Screen>
);

/* 07 — Observability: one search bar over every service's logs */
const LOGS = [
  ["12:04:31.118", "svc-payments", "INFO", "transfer accepted amount=250000.00 ccy=USD"],
  ["12:04:31.121", "svc-auth", "INFO", "maker-checker pending approver=required"],
  ["12:04:31.140", "svc-cards", "DEBUG", "limit check ok remaining=…"],
  ["12:04:32.002", "svc-auth", "INFO", "approval granted by=checker"],
  ["12:04:32.010", "svc-payments", "INFO", "transfer released rail=wire"],
  ["12:04:32.011", "svc-audit", "INFO", "event stored topic=audit.events"],
] as const;
export const LogScreen = () => (
  <Screen>
    <Bar>
      <span className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-muted">kibana</span>
        <span className="flex-1 rounded-sm border border-line bg-night/70 px-2 py-1 text-snow">
          trace_id:<span className="text-emerald-300">9f3a2c1e</span>
        </span>
      </span>
      <span className="text-muted shrink-0">6 hits · 4 services</span>
    </Bar>
    <div className="flex-1 p-3 md:p-4 flex flex-col justify-center gap-1 min-h-0">
      {LOGS.map(([ts, svc, lvl, msg]) => (
        <motion.div
          key={ts}
          variants={rise}
          className="grid grid-cols-[auto_auto_auto_1fr] items-center gap-x-3 rounded-sm px-2 py-1.5 hover:bg-snow/[0.04] text-[10px] md:text-[11px]"
        >
          <span className="text-muted">{ts}</span>
          <span className="text-snow">{svc}</span>
          <span className={lvl === "DEBUG" ? "text-snow/40" : "text-emerald-300"}>{lvl}</span>
          <span className="text-snow/75 break-words">{msg}</span>
        </motion.div>
      ))}
      <motion.div
        variants={rise}
        className="mt-4 flex items-center justify-between rounded-sm border border-dashed border-emerald-400/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-emerald-300"
      >
        <span>logstash → elasticsearch → kibana</span>
        <span className="normal-case tracking-normal text-emerald-300/80">transport: kafka</span>
      </motion.div>
    </div>
  </Screen>
);

/* 08 — VoxOs: a menu-bar voice agent for the Mac */
const BARS = [3, 6, 10, 16, 22, 14, 26, 18, 9, 20, 28, 15, 7, 12, 24, 17, 6, 11, 19, 9, 4];
export const VoxScreen = () => (
  <Screen>
    <Bar>
      <span className="text-muted">
        VoxOs · <span className="text-snow/80">menu bar</span> · macOS 14.4+
      </span>
      <span className="flex items-center gap-2">
        <Tag accent>on-device speech</Tag>
        <Tag>Swift</Tag>
      </span>
    </Bar>
    <div className="flex-1 grid md:grid-cols-[1fr_220px] gap-3 p-4 md:p-5 min-h-0">
      <div className="flex flex-col justify-center gap-4">
        <motion.div variants={rise} className="flex items-end justify-center gap-[3px] h-16">
          {BARS.map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-pill bg-emerald-400/80 vox-bar"
              style={{ height: `${h * 3}%`, animationDelay: `${i * 70}ms` }}
            />
          ))}
        </motion.div>
        <motion.div
          variants={rise}
          className="rounded-sm border border-line bg-night/60 px-4 py-3 text-snow text-[12px] md:text-sm"
        >
          "open the pull request for the billing branch and start the tests"
        </motion.div>
        <motion.div variants={rise} className="flex items-center justify-center gap-2 text-[10px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> listening · hold ⌥ to dictate
        </motion.div>
      </div>
      <motion.aside
        variants={rise}
        className="rounded-sm border border-line bg-night/60 p-3 flex flex-col gap-2 text-[10px]"
      >
        <span className="text-muted uppercase tracking-[0.2em]">Actions</span>
        {[
          ["gh pr create --head billing", "ok"],
          ["npm test", "ok"],
          ["focus Terminal", "ok"],
          ["dictate → cursor", "warn"],
        ].map(([a, t]) => (
          <span key={a} className="flex items-center justify-between gap-2 text-snow/80">
            <span className="break-words">{a}</span> <Dot tone={t as "ok" | "warn"} />
          </span>
        ))}
        <span className="mt-auto text-muted">audio never leaves the Mac</span>
      </motion.aside>
    </div>
  </Screen>
);

/* 09 — Kairo: a bank whose assistant runs on the phone */
export const KairoScreen = () => (
  <Screen>
    <Bar>
      <span className="text-muted">
        Kairo · <span className="text-snow/80">offline-first</span>
      </span>
      <span className="flex items-center gap-2">
        <Tag accent>Qwen on-device</Tag>
        <Tag>no network calls</Tag>
      </span>
    </Bar>
    <div className="flex-1 grid md:grid-cols-[220px_1fr] gap-3 p-4 md:p-5 min-h-0">
      <motion.div variants={rise} className="rounded-md border border-line bg-night/70 p-3 flex flex-col gap-2">
        <span className="text-[10px] text-muted uppercase tracking-[0.2em]">Accounts</span>
        {[
          ["Everyday", "····4471"],
          ["Savings", "····0928"],
          ["Portfolio", "3 holdings"],
        ].map(([n, sub]) => (
          <span key={n} className="flex items-center justify-between rounded-sm bg-snow/[0.05] px-2.5 py-2">
            <span className="text-snow">{n}</span>
            <span className="text-[10px] text-muted">{sub}</span>
          </span>
        ))}
        <span className="mt-auto flex items-center gap-2 text-[10px] text-emerald-300">
          <Dot /> all data on this device
        </span>
      </motion.div>
      <div className="flex flex-col justify-center gap-2">
        {[
          ["user", "Anything odd in my spending this month?"],
          [
            "bot",
            "Two things. A new merchant charged twice within a minute, and your subscriptions rose 18% against your usual run rate.",
          ],
          ["chip", "anomaly detection · semantic search · ran locally in 0.8s"],
          ["bot", "Want me to draft a dispute for the double charge?"],
        ].map(([who, text], i) => (
          <motion.div
            key={i}
            variants={rise}
            className={
              who === "chip"
                ? "self-start text-[10px] text-emerald-300 border border-emerald-400/40 rounded-pill px-3 py-1"
                : who === "user"
                  ? "self-end max-w-[80%] rounded-md rounded-br-none bg-snow text-night px-3 py-2"
                  : "self-start max-w-[80%] rounded-md rounded-bl-none bg-snow/[0.08] border border-line px-3 py-2"
            }
          >
            {text}
          </motion.div>
        ))}
      </div>
    </div>
  </Screen>
);
