import { Activity, GitCommit } from "lucide-react";
import { useEffect, useState } from "react";

export default function ActivityWidget() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to animate in after initial load
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[90] hidden md:flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-pulse" />
        <div className="relative bg-black/80 border border-white/10 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-3 shadow-2xl transition-all duration-300 hover:border-emerald-500/50 hover:bg-black">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest leading-none mb-1">
              SYSTEM_STATUS
            </span>
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-white/90 font-medium">Building the Future</span>
            </div>
          </div>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <div className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer" title="Mocked Git Commits (Today)">
            <GitCommit className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
