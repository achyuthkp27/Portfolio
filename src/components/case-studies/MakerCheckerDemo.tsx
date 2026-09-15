import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Status = "draft" | "pending" | "posted" | "rejected";

interface LogEntry {
  id: number;
  tone: "ok" | "warn" | "info";
  text: string;
}

const STATUS_COPY: Record<Status, { label: string; className: string }> = {
  draft: { label: "No request", className: "text-white/60 border-white/15" },
  pending: { label: "Pending approval", className: "text-amber-200 border-amber-300/40 bg-amber-300/[0.06]" },
  posted: { label: "Posted to core banking", className: "text-emerald-300 border-emerald-400/50 bg-emerald-400/[0.08]" },
  rejected: { label: "Rejected, returned to maker", className: "text-white/80 border-white/30 bg-white/[0.05]" },
};

const TONE_CLASS: Record<LogEntry["tone"], string> = {
  ok: "text-emerald-300",
  warn: "text-amber-200",
  info: "text-white/70",
};

/**
 * Illustrative model of a four-eyes control: the person who initiates a
 * transaction can never be the one who approves it.
 */
const MakerCheckerDemo = () => {
  const [status, setStatus] = useState<Status>("draft");
  const [log, setLog] = useState<LogEntry[]>([]);

  const push = (tone: LogEntry["tone"], text: string) =>
    setLog((current) => [{ id: Date.now() + Math.random(), tone, text }, ...current].slice(0, 4));

  const initiate = () => {
    setStatus("pending");
    push("info", "Maker submitted a transfer. Funds are held, nothing posted yet.");
  };
  const selfApprove = () => push("warn", "Blocked. The maker cannot approve their own request.");
  const approve = () => {
    setStatus("posted");
    push("ok", "A second user approved. Transaction posted and audit record written.");
  };
  const reject = () => {
    setStatus("rejected");
    push("info", "Checker rejected. Hold released and the maker is notified.");
  };
  const reset = () => {
    setStatus("draft");
    setLog([]);
  };

  const btn =
    "px-3 py-2 rounded-md text-xs md:text-[13px] font-body font-medium border transition-colors disabled:opacity-30 disabled:cursor-not-allowed";

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between gap-3 mb-5">
        <span className="font-mono text-[11px] text-white/55">wire transfer · USD 250,000.00</span>
        <span className={`px-2.5 py-1 rounded-full border text-[11px] font-body font-medium ${STATUS_COPY[status].className}`} role="status">
          {STATUS_COPY[status].label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-lg border border-white/15 bg-white/[0.03] p-3">
          <div className="text-[11px] font-body uppercase tracking-[0.15em] text-white/55 mb-2.5">Maker</div>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={initiate} disabled={status === "pending"} className={`${btn} border-white/20 text-white hover:bg-white/10`}>
              Submit transfer
            </button>
            <button type="button" onClick={selfApprove} disabled={status !== "pending"} className={`${btn} border-white/15 text-white/80 hover:bg-white/5`}>
              Approve own request
            </button>
          </div>
        </div>
        <div className="rounded-lg border border-white/15 bg-white/[0.03] p-3">
          <div className="text-[11px] font-body uppercase tracking-[0.15em] text-white/55 mb-2.5">Checker</div>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={approve} disabled={status !== "pending"} className={`${btn} border-emerald-400/40 text-emerald-200 hover:bg-emerald-400/10`}>
              Approve
            </button>
            <button type="button" onClick={reject} disabled={status !== "pending"} className={`${btn} border-white/15 text-white/80 hover:bg-white/5`}>
              Reject
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-[108px] rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed" aria-live="polite">
        {log.length === 0 ? (
          <p className="text-white/45">Submit a transfer as the maker, then try approving it yourself.</p>
        ) : (
          <AnimatePresence initial={false}>
            {log.map((entry, i) => (
              <motion.p
                key={entry.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: i === 0 ? 1 : 0.5, y: 0 }}
                className={TONE_CLASS[entry.tone]}
              >
                {entry.text}
              </motion.p>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="flex items-center justify-between mt-3">
        <span className="text-[11px] font-body text-white/45">Illustrative model, not production code</span>
        {status !== "draft" && (
          <button type="button" onClick={reset} className="text-[11px] font-body text-white/60 hover:text-white underline underline-offset-2">
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default MakerCheckerDemo;
