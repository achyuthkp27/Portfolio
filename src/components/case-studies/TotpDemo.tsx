import { useEffect, useRef, useState } from "react";
import { TOTP_STEP_SECONDS, counterFor, generateTotp, isTotpSupported } from "@/lib/totp";

// Public demo secret. Real enrolment keeps this AES-256-GCM encrypted server-side.
const DEMO_SECRET = new TextEncoder().encode("portfolio-demo-secret");

type Verdict = { tone: "ok" | "warn"; text: string } | null;

/**
 * Live RFC 6238 code with a server-side replay check: a code is accepted once
 * per time step, then remembered (the production system keeps it in Redis).
 */
const TotpDemo = () => {
  const [code, setCode] = useState("······");
  const [secondsLeft, setSecondsLeft] = useState(TOTP_STEP_SECONDS);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const usedCodes = useRef(new Set<string>());
  const counterRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isTotpSupported()) return;
    let cancelled = false;

    const tick = async () => {
      const now = Date.now();
      const counter = counterFor(now);
      setSecondsLeft(TOTP_STEP_SECONDS - (Math.floor(now / 1000) % TOTP_STEP_SECONDS));
      if (counter !== counterRef.current) {
        counterRef.current = counter;
        const next = await generateTotp(DEMO_SECRET, counter);
        if (!cancelled) {
          setCode(next);
          setVerdict(null);
        }
      }
    };

    void tick();
    const id = window.setInterval(() => void tick(), 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (!isTotpSupported()) return null;

  const key = `${counterRef.current}:${code}`;

  const submit = () => {
    if (usedCodes.current.has(key)) {
      setVerdict({ tone: "warn", text: "Rejected. This code was already used in this time step (replay)." });
      return;
    }
    usedCodes.current.add(key);
    setVerdict({ tone: "ok", text: "Accepted. Code stored as used until the step expires." });
  };

  const submitWrong = () => {
    const wrong = code.split("").reverse().join("") === code ? "000000" : code.split("").reverse().join("");
    setVerdict({ tone: "warn", text: `Rejected. ${wrong} does not match the expected code for this step.` });
  };

  return (
    <div data-reveal-skip className="w-full max-w-md">
      <div
        className="flex justify-center gap-1.5 md:gap-2 mb-3"
        aria-label={`Current code ${code.split("").join(" ")}`}
      >
        {code.split("").map((digit, i) => (
          <span
            key={i}
            className="w-10 h-12 md:w-11 md:h-14 rounded-sm bg-snow/[0.06] border border-line flex items-center justify-center t-figure text-xl md:text-2xl text-emerald-100"
          >
            {digit}
          </span>
        ))}
      </div>

      <div className="h-1 rounded-full bg-snow/10 overflow-hidden mb-2" aria-hidden="true">
        <div
          className="h-full bg-emerald-400 transition-[width] duration-1000 ease-linear"
          style={{ width: `${(secondsLeft / TOTP_STEP_SECONDS) * 100}%` }}
        />
      </div>
      <p className="text-center t-figure text-[11px] text-muted mb-5">
        New code in {secondsLeft}s · HMAC-SHA1 · 30 s step
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          type="button"
          onClick={submit}
          className="px-3 py-2 rounded-sm text-xs md:text-[13px] font-body font-medium border border-emerald-400/60 text-emerald-200 hover:bg-emerald-400/10 transition-colors duration-fast"
        >
          Submit this code
        </button>
        <button
          type="button"
          onClick={submitWrong}
          className="px-3 py-2 rounded-sm text-xs md:text-[13px] font-body font-medium border border-line text-snow/80 hover:bg-snow/5 transition-colors duration-fast"
        >
          Submit a wrong code
        </button>
      </div>

      <p
        className={`min-h-[40px] rounded-sm border border-line bg-night/60 px-3 py-2.5 font-mono text-[11px] leading-relaxed ${
          verdict ? (verdict.tone === "ok" ? "text-emerald-300" : "text-snow") : "text-muted"
        }`}
        aria-live="polite"
      >
        {verdict ? verdict.text : "Submit the code twice to see replay prevention."}
      </p>
      <p className="mt-3 text-[11px] font-body text-muted">Real RFC 6238 running in your browser, with a demo secret</p>
    </div>
  );
};

export default TotpDemo;
