import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?~`";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [glitchText, setGlitchText] = useState("404");
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Glitch effect on the 404 text
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldGlitch = Math.random() > 0.7;
      if (shouldGlitch) {
        const glitched = "404"
          .split("")
          .map((char) =>
            Math.random() > 0.5
              ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
              : char
          )
          .join("");
        setGlitchText(glitched);
        setTimeout(() => setGlitchText("404"), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate("/");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white px-6 relative overflow-hidden">
      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
        }}
      />

      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-[0.02] pointer-events-none" />

      <div className="text-center relative z-20 max-w-lg">
        {/* Glitching 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-8"
        >
          <h1
            className="text-[25vw] md:text-[12rem] font-display font-bold leading-none tracking-tighter select-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {glitchText}
          </h1>

          {/* Emerald accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
          />
        </motion.div>

        {/* Error message — terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4 mb-12"
        >
          <div className="font-mono text-[10px] text-white/20 tracking-[0.3em] uppercase">
            ERR_ROUTE_NOT_FOUND
          </div>
          <p className="font-mono text-sm text-white/40 leading-relaxed">
            <span className="text-emerald-500/60">{">"}</span> The requested path{" "}
            <span className="text-white/60 bg-white/5 px-2 py-0.5 rounded">
              {location.pathname}
            </span>{" "}
            does not exist in this system.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            className="group relative inline-flex items-center gap-3 px-8 py-3 bg-white text-black font-mono text-[11px] font-bold tracking-[0.3em] uppercase overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white via-emerald-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10">RETURN_HOME</span>
          </a>

          <button
            onClick={() => window.history.back()}
            className="group relative inline-flex items-center gap-3 px-8 py-3 border border-white/10 text-white/50 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-emerald-500/30 hover:text-white/80 transition-all duration-500"
          >
            GO_BACK
          </button>
        </motion.div>

        {/* Auto-redirect notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12 font-mono text-[9px] text-white/15 tracking-[0.2em] uppercase"
        >
          AUTO_REDIRECT_IN{" "}
          <span className="text-emerald-500/40 tabular-nums">
            {countdown.toString().padStart(2, "0")}
          </span>
          s
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
