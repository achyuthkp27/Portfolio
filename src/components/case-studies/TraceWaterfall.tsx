import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { DUR, EASE } from "@/lib/motion";

/**
 * A corporate wire transfer drawn as a distributed trace — the artifact I actually
 * read when triaging this platform. Bars are relative shape, not measured timings:
 * what matters here is the order, the nesting, and where the four-eyes gate sits.
 */

interface Span {
  service: string;
  name: string;
  /** Nesting under the root request */
  depth: 0 | 1 | 2;
  /** Position and length along the trace, 0–100 */
  start: number;
  end: number;
  note: string;
  /** Infrastructure hops render quieter than service work */
  infra?: boolean;
}

const SPANS: Span[] = [
  {
    service: "api-gateway",
    name: "POST /corporate/transfers",
    depth: 0,
    start: 0,
    end: 100,
    note: "The root span. Everything below happens inside this one request, and the gateway is the only thing the channel ever talks to.",
  },
  {
    service: "auth-service",
    name: "verify JWT · decrypt JWE payload",
    depth: 1,
    start: 3,
    end: 11,
    note: "Token signature and claims first, then the encrypted body is opened. A request that fails here never reaches a domain service.",
  },
  {
    service: "auth-service",
    name: "TOTP step-up · high value",
    depth: 1,
    start: 11,
    end: 23,
    note: "Above the threshold the transfer needs a fresh TOTP. The code is checked once and burned, so a replayed code lands on a used marker.",
  },
  {
    service: "accounts-service",
    name: "balance & limit check",
    depth: 1,
    start: 24,
    end: 38,
    note: "Does the account hold the funds, and is the corporate inside its daily and per-transaction limits?",
  },
  {
    service: "postgres",
    name: "SELECT account, limits",
    depth: 2,
    start: 27,
    end: 35,
    note: "Read of the account row and its limit set, inside the accounts-service span.",
    infra: true,
  },
  {
    service: "approvals-service",
    name: "create maker request",
    depth: 1,
    start: 39,
    end: 52,
    note: "The maker's submission becomes a pending request. Nothing moves yet — this is the framework the maker-checker case study is about.",
  },
  {
    service: "postgres",
    name: "INSERT approval_request",
    depth: 2,
    start: 43,
    end: 50,
    note: "The pending request is written before any event is published, so the record exists even if the next hop fails.",
    infra: true,
  },
  {
    service: "kafka",
    name: "publish transfer.requested",
    depth: 1,
    start: 53,
    end: 60,
    note: "Downstream services learn about the request by event, not by call — a slow consumer cannot stall the payment path.",
    infra: true,
  },
  {
    service: "approvals-service",
    name: "checker approves · four eyes",
    depth: 1,
    start: 61,
    end: 74,
    note: "A second user approves. The service refuses if the checker is the maker, which is the whole control PCI-DSS and SOX audits look for.",
  },
  {
    service: "ledger-service",
    name: "post double entry",
    depth: 1,
    start: 75,
    end: 88,
    note: "Only now does money move: debit and credit written together, or neither is written at all.",
  },
  {
    service: "postgres",
    name: "INSERT ledger_entry ×2",
    depth: 2,
    start: 78,
    end: 86,
    note: "Both legs in one transaction. A partial post is the one outcome a ledger can never produce.",
    infra: true,
  },
  {
    service: "kafka",
    name: "publish transfer.posted",
    depth: 1,
    start: 88,
    end: 94,
    note: "The settled event fans out to notifications, statements and the reporting pipeline.",
    infra: true,
  },
  {
    service: "notification-service",
    name: "push + email to both parties",
    depth: 1,
    start: 94,
    end: 100,
    note: "Consumes the settled event. It is deliberately outside the transaction — a failed push must never roll back a posted transfer.",
  },
  {
    service: "logstash → elasticsearch",
    name: "index spans & logs",
    depth: 2,
    start: 96,
    end: 100,
    note: "Every span above lands in one searchable index. That rollout is its own case study further up.",
    infra: true,
  },
];

const INDENT = ["pl-0", "pl-3 md:pl-6", "pl-6 md:pl-12"] as const;

const COMPONENTS = new Set(SPANS.map((s) => s.service)).size;

/**
 * Jaeger puts the span name inside its bar when the bar is wide enough, and beside it
 * when it is not — on whichever side has room. Anything else either clips the name or
 * lets it run across the empty track.
 */
function labelPosition(span: Span) {
  if (span.end - span.start >= 40) {
    return { left: `${span.start}%`, width: `${span.end - span.start}%`, justify: "justify-start", pad: "pl-2" };
  }
  if (span.start < 55) {
    return { left: `calc(${span.end}% + 0.5rem)`, right: 0, justify: "justify-start", pad: "" };
  }
  return { right: `calc(${100 - span.start}% + 0.5rem)`, left: 0, justify: "justify-end", pad: "" };
}

const TraceWaterfall = () => {
  const [selected, setSelected] = useState(0);
  const [run, setRun] = useState(0);
  const active = SPANS[selected];

  return (
    <div data-reveal-skip className="rounded-lg bg-tile text-snow p-5 md:p-8 lg:p-10">
      <div className="relative">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-line">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-full border border-emerald-400/50 bg-emerald-400/[0.08] text-[11px] font-body font-medium text-emerald-200 shrink-0">
              Trace
            </span>
            <span className="t-figure text-[11px] md:text-xs text-muted truncate">
              wire transfer · {SPANS.length} spans · {COMPONENTS} components
            </span>
          </div>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-sm border border-line text-[11px] font-body font-medium text-snow hover:border-emerald-400/70 hover:bg-emerald-400/[0.06] transition-colors duration-fast"
          >
            <Play className="w-3 h-3" aria-hidden="true" /> Replay
          </button>
        </div>

        {/* Waterfall */}
        <ul key={run} className="mt-5 space-y-[3px]">
          {SPANS.map((span, i) => {
            const isActive = i === selected;
            const label = labelPosition(span);
            return (
              <li key={`${span.service}-${span.name}`}>
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  onMouseEnter={() => setSelected(i)}
                  onFocus={() => setSelected(i)}
                  aria-pressed={isActive}
                  aria-controls="trace-span-detail"
                  className={`w-full block rounded-sm px-2 py-1.5 text-left transition-colors duration-fast ${
                    isActive ? "bg-snow/[0.06]" : "hover:bg-snow/[0.03]"
                  }`}
                >
                  <span className="md:grid md:grid-cols-[13rem_1fr] md:items-center md:gap-5">
                    <span className={`block min-w-0 ${INDENT[span.depth]}`}>
                      <span
                        className={`block font-mono text-[10px] md:text-[11px] truncate transition-colors ${
                          isActive ? "text-emerald-300" : span.infra ? "text-muted" : "text-snow/80"
                        }`}
                      >
                        {span.service}
                      </span>
                    </span>

                    <span className="relative block h-[22px] mt-1 md:mt-0">
                      <span
                        className="absolute inset-y-0 left-0 right-0 rounded-[3px] bg-snow/[0.03]"
                        aria-hidden="true"
                      />
                      <motion.span
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: "-15%" }}
                        transition={{ duration: DUR.base, delay: (span.start / 100) * 1.1, ease: EASE }}
                        style={{
                          left: `${span.start}%`,
                          width: `${Math.max(span.end - span.start, 2)}%`,
                          transformOrigin: "left",
                        }}
                        className={`absolute inset-y-[3px] rounded-[3px] border ${
                          span.infra ? "bg-snow/[0.08] border-line" : "bg-emerald-400/25 border-emerald-400/60"
                        } ${isActive ? "ring-1 ring-emerald-300/70" : ""}`}
                      />
                      <span
                        style={label}
                        className={`absolute inset-y-0 flex items-center ${label.justify} ${label.pad} font-mono text-[10px] md:text-[11px] pointer-events-none overflow-hidden transition-colors ${
                          isActive ? "text-snow" : "text-muted"
                        }`}
                      >
                        <span className="truncate">{span.name}</span>
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Axis */}
        <div className="mt-3 grid md:grid-cols-[13rem_1fr] md:gap-5 px-2">
          <span className="hidden md:block" />
          <span className="flex items-center gap-2 font-mono text-[10px] text-muted">
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
            relative order and nesting, not measured timings
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </span>
        </div>

        {/* Selected span */}
        <div id="trace-span-detail" aria-live="polite" className="mt-6 pt-6 border-t border-line min-h-[6.5rem]">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DUR.fast, ease: EASE }}
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-xs text-emerald-300">{active.service}</span>
              <span className="font-mono text-xs text-muted">·</span>
              <span className="font-mono text-xs text-snow/80">{active.name}</span>
            </div>
            <p className="mt-2.5 text-[15px] text-snow/80 leading-relaxed max-w-3xl">{active.note}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TraceWaterfall;
