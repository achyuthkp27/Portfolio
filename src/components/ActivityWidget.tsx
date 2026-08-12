import { Activity, GitCommit } from "lucide-react";
import { useEffect, useState } from "react";

const GITHUB_USERNAME = "achyuthkp27";
const CACHE_KEY = "github_yearly_commits";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export default function ActivityWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [commits, setCommits] = useState<number | null>(null);

  useEffect(() => {
    // Show widget after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
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
          },
          signal: controller.signal
        });
        
        if (!res.ok) throw new Error("Rate limited or failed");
        
        const data = await res.json();
        if (data.total_count !== undefined && !controller.signal.aborted) {
          setCommits(data.total_count);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ count: data.total_count, timestamp: Date.now() }));
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.warn("Failed to fetch live commits; hiding counter.");
        }
        // No invented fallback number — hide the counter instead
      }
    };

    fetchCommits();
    return () => controller.abort();
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[90] hidden md:flex animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Collapsed by default: status dot + commit count. Expands on hover/focus. */}
      <a
        href={`https://github.com/${GITHUB_USERNAME}`}
        target="_blank"
        rel="noreferrer"
        title={commits === null ? "GitHub profile" : `Commits this year: ${commits} (live)`}
        aria-label="GitHub profile — currently shipping banking systems"
        className="group relative bg-black/80 border border-white/10 backdrop-blur-md rounded-full px-3.5 py-2 flex items-center gap-2.5 shadow-2xl opacity-60 hover:opacity-100 focus-visible:opacity-100 transition-all duration-300 hover:border-white/25 hover:bg-black"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        <span className="flex items-center gap-1.5 text-white/60 group-hover:text-white/80 transition-colors shrink-0">
          <GitCommit className="w-3.5 h-3.5" />
          <span className="text-xs font-mono">{commits ?? "GitHub"}</span>
        </span>

        {/* Expanded detail — width animates open on hover */}
        <span className="flex items-center gap-2 max-w-0 opacity-0 group-hover:max-w-[240px] group-hover:opacity-100 group-focus-visible:max-w-[240px] group-focus-visible:opacity-100 overflow-hidden whitespace-nowrap transition-all duration-500 ease-out">
          <span className="w-px h-5 bg-white/10 shrink-0" />
          <Activity className="w-3 h-3 text-emerald-400 shrink-0" />
          <span className="text-xs text-white/90 font-medium pr-1">Shipping banking systems</span>
        </span>
      </a>
    </div>
  );
}
