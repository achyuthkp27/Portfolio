import { Activity, GitCommit } from "lucide-react";
import { useEffect, useState } from "react";

const GITHUB_USERNAME = "achyuthkp27";
const CACHE_KEY = "github_yearly_commits";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export default function ActivityWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [commits, setCommits] = useState<number | string>("350+");

  useEffect(() => {
    // Show widget after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        // Check Cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { count, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCommits(count);
            return;
          }
        }

        const year = new Date().getFullYear();
        // Fetch from GitHub Search API (requires the cloak-preview header)
        const res = await fetch(`https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}+committer-date:>${year}-01-01`, {
          headers: {
            Accept: "application/vnd.github.cloak-preview"
          }
        });
        
        if (!res.ok) throw new Error("Rate limited or failed");
        
        const data = await res.json();
        if (data.total_count !== undefined) {
          setCommits(data.total_count);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ count: data.total_count, timestamp: Date.now() }));
        }
      } catch (error) {
        console.warn("Failed to fetch live commits. Using fallback.");
        // Leave it as "350+" if we get rate limited
      }
    };

    fetchCommits();
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

          <a 
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-white/60 hover:text-emerald-400 transition-colors cursor-pointer" 
            title={`Total Commits this Year: ${commits} (Live)`}
          >
            <GitCommit className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">{commits}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
