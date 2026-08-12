import { useState, useEffect, useRef } from "react";
import { Terminal, X } from "lucide-react";
import { useAnalytics } from "@/lib/analytics";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experience";
import { fetchLatestRepositories, GitHubRepo } from "@/lib/github";

interface TerminalOverlayProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function TerminalOverlay({ forceOpen = false, onClose }: TerminalOverlayProps) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [theme, setTheme] = useState<'emerald' | 'amber' | 'zinc'>(() => {
    const saved = localStorage.getItem('terminal_theme');
    return (saved as 'emerald' | 'amber' | 'zinc') || 'emerald';
  });

  useEffect(() => {
    localStorage.setItem('terminal_theme', theme);
  }, [theme]);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [history, setHistory] = useState<{ type: 'input' | 'output' | 'system' | 'error'; text: string | React.ReactNode }[]>([
    { type: 'system', text: 'Welcome to ACHYUTH_OS v2.4.1 [Secure Line]' },
    { type: 'system', text: 'Authorization recognized. Type "help" to view directory.' }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hackIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Stop any streaming 'hack' output if the terminal unmounts mid-sequence
  useEffect(() => {
    return () => {
      if (hackIntervalRef.current) clearInterval(hackIntervalRef.current);
    };
  }, []);
  const posthog = useAnalytics();

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // Fetch GitHub repos on mount
  useEffect(() => {
    fetchLatestRepositories(5).then(setGithubRepos);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll locking & Focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      if (onClose) onClose();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, onClose]);

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e?: React.FormEvent, manualCmd?: string) => {
    if (e) e.preventDefault();
    const rawInput = manualCmd || input;
    const trimmedInput = rawInput.trim();
    if (!trimmedInput) return;

    const fullCmd = trimmedInput;
    const cmd = fullCmd.toLowerCase().split(' ')[0];
    const args = fullCmd.split(' ').slice(1).join(' ');
    const newHistory = [...history, { type: 'input' as const, text: fullCmd }];

    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'output', text: (
            <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1 my-2 text-[12px] sm:text-sm">
                <span className="text-emerald-400 font-bold">about</span><span>Personnel bio & directives</span>
                <span className="text-emerald-400 font-bold">skills</span><span>Technical weaponry</span>
                <span className="text-emerald-400 font-bold">projects</span><span>Classified deployments</span>
                <span className="text-emerald-400 font-bold">gh</span><span>Sync GitHub repository nodes</span>
                <span className="text-emerald-400 font-bold">socials</span><span>External nodes (LinkedIn, Mail)</span>
                <span className="text-emerald-400 font-bold">neofetch</span><span>System configuration overview</span>
                <span className="text-emerald-400 font-bold">theme</span><span>Toggle UI color matrix</span>
                <span className="text-emerald-400 font-bold">diagnostics</span><span>System health report</span>
                <span className="text-emerald-400 font-bold">clear</span><span>Flush buffer</span>
                <span className="text-emerald-400 font-bold">hack</span><span>Initialize breach simulation</span>
                <span className="text-emerald-400 font-bold">exit</span><span>Terminate session</span>
            </div>
        )});
        break;
      case 'clear':
        setHistory([{ type: 'system', text: 'BUFFER_PURGED. SYSTEM_READY.' }]);
        setInput("");
        return;
      case 'about':
        newHistory.push({ type: 'output', text: 'IDENTITY: ACHYUTH KP\nROLE: SR. SOFTWARE DEVELOPER\nLOC: BANGALORE, IN\nFOCUS: SCALABLE BACKEND & IMMERSIVE FRONTEND\nEMAIL: kpachyuthz@gmail.com' });
        break;
      case 'gh':
        newHistory.push({ type: 'system', text: 'SYNCING WITH GITHUB_API...' });
        if (githubRepos.length === 0) {
            newHistory.push({ type: 'error', text: 'Error: No nodes found or rate-limit reached.' });
        } else {
            newHistory.push({ type: 'output', text: (
                <div className="my-2 space-y-1">
                    {githubRepos.map(repo => (
                        <div key={repo.id} className="flex items-center justify-between group">
                            <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline flex items-center gap-2">
                                <span className="text-[10px] opacity-40">[]</span> {repo.name}
                            </a>
                            <div className="flex gap-3 text-[10px] text-white/40">
                                <span>★ {repo.stargazers_count}</span>
                                <span className="hidden sm:inline">{repo.language}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )});
        }
        break;
      case 'projects':
        newHistory.push({ type: 'output', text: (
            <div className="my-2 space-y-2">
                {projects.map((p, i) => (
                    <div key={p.slug} className="group flex items-start gap-3 p-2 hover:bg-white/5 rounded transition-colors border border-transparent hover:border-white/10">
                        <span className="text-emerald-500/50 mt-1 font-bold">{i+1}.</span>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold">{p.title}</span>
                                <span className="text-[10px] px-1 bg-white/10 rounded text-white/60">{p.category}</span>
                            </div>
                            <p className="text-xs text-white/60 leading-relaxed mt-0.5">{p.description}</p>
                            <div className="flex gap-2 mt-1">
                                {p.tags.slice(0, 3).map(t => <span key={t} className="text-[10px] text-emerald-400/70">#{t}</span>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )});
        break;
      case 'skills':
        newHistory.push({ type: 'output', text: (
            <div className="my-2 space-y-3">
                <div>
                    <span className="text-emerald-400 font-bold block mb-1">BACKEND</span>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {["Java", "Spring Boot", "Spring Security", "Kafka", "PostgreSQL", "Redis", "gRPC"].map(s => <span key={s} className="px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">{s}</span>)}
                    </div>
                </div>
                <div>
                    <span className="text-emerald-400 font-bold block mb-1">QUALITY & OPS</span>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {["JUnit", "Mockito", "Jenkins", "Docker", "ELK Stack", "AWS"].map(s => <span key={s} className="px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">{s}</span>)}
                    </div>
                </div>
            </div>
        )});
        break;
      case 'socials':
        newHistory.push({ type: 'output', text: (
            <div className="my-2 flex flex-col gap-2">
                <a href="https://github.com/achyuthkp27" target="_blank" rel="noreferrer" className="text-white hover:text-emerald-400 underline">GitHub: achyuthkp27</a>
                <a href="https://www.linkedin.com/in/kpachyuth" target="_blank" rel="noreferrer" className="text-white hover:text-emerald-400 underline">LinkedIn: kpachyuth</a>
                <a href="mailto:kpachyuthz@gmail.com" className="text-white hover:text-emerald-400 underline">Email: kpachyuthz@gmail.com</a>
            </div>
        )});
        break;
      case 'neofetch':
        newHistory.push({ type: 'output', text: (
            <div className="flex gap-6 py-2">
                <div className="text-emerald-500 font-bold leading-tight">
                    <pre>{`
   /\\
  /  \\
 /____\\
|      |
|  OS  |
|______|
`}</pre>
                </div>
                <div className="space-y-1">
                    <div className="text-emerald-400 font-bold underline">achyuth@os</div>
                    <div className="text-xs">OS: achyuth-sh 1.0</div>
                    <div className="text-xs">Host: portfolio-v3</div>
                    <div className="text-xs">Kernel: react-v18.x</div>
                    <div className="text-xs">Shell: achyuth-sh</div>
                    <div className="text-xs">Uptime: 5+ years (Banking-grade)</div>
                    <div className="text-xs">Terminal: matrix-emerald</div>
                </div>
            </div>
        )});
        break;
      case 'theme':
        if (args === 'amber') {
            setTheme('amber');
            newHistory.push({ type: 'system', text: 'COLOR_MATRIX: AMBER_CRT_ACTIVATED' });
        } else if (args === 'zinc') {
            setTheme('zinc');
            newHistory.push({ type: 'system', text: 'COLOR_MATRIX: ZINC_MONOCHROME_ACTIVATED' });
        } else if (args === 'emerald') {
            setTheme('emerald');
            newHistory.push({ type: 'system', text: 'COLOR_MATRIX: EMERALD_PHOSPHOR_ACTIVATED' });
        } else {
            newHistory.push({ type: 'output', text: 'Usage: theme <name>\nAvailable themes: emerald, amber, zinc' });
        }
        break;
      case 'diagnostics':
        newHistory.push({ type: 'system', text: 'RUNNING_SYSTEM_INTEGRITY_CHECK...' });
        newHistory.push({ type: 'output', text: (
            <div className="space-y-1 my-2 text-xs">
                <div className="flex justify-between"><span>CPU_CORES [8]</span><span className="text-emerald-400">[ONLINE]</span></div>
                <div className="flex justify-between"><span>MEMORY_LOAD</span><span>[||||------] 42%</span></div>
                <div className="flex justify-between"><span>LATENCY</span><span>24ms (Secure Node)</span></div>
                <div className="flex justify-between"><span>FIREWALL</span><span className="text-emerald-400">ACTIVE</span></div>
                <div className="flex justify-between"><span>UPTIME</span><span>99.98%</span></div>
            </div>
        )});
        break;
      case 'hack': {
        newHistory.push({ type: 'system', text: 'INITIALIZING_BRUTE_FORCE_SEQUENCE...' });
        let i = 0;
        if (hackIntervalRef.current) clearInterval(hackIntervalRef.current);
        const hackInterval = setInterval(() => {
            const logs = [
                "[OK] Bypassing firewall...",
                "[OK] Injecting SQL payload...",
                "[OK] Escalating privileges...",
                "[OK] Accessing database...",
                "[!] SECURITY BREACH DETECTED!",
                "Terminating connection..."
            ];
            if (i < logs.length) {
                setHistory(prev => [...prev, { type: 'error', text: logs[i] }]);
                i++;
            } else {
                clearInterval(hackInterval);
                hackIntervalRef.current = null;
            }
        }, 400);
        hackIntervalRef.current = hackInterval;
        break;
      }
      case 'exit':
        setIsOpen(false);
        setInput("");
        return;
      case 'sudo':
        if (args === 'rm -rf /') {
            newHistory.push({ type: 'error', text: 'NICE TRY. SELF-DESTRUCT SEQUENCE ABORTED.' });
        } else {
            newHistory.push({ type: 'error', text: '[!] nice try. user not in sudoers file.' });
        }
        break;
      default:
        newHistory.push({ type: 'error', text: `Command not found: ${cmd}. Type 'help' for directory.` });
    }

    setHistory(newHistory);
    setInput("");
  };

  if (!isOpen) return null;

  const themeColors = {
    emerald: "text-emerald-500 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]",
    amber: "text-amber-500 border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)]",
    zinc: "text-zinc-300 border-zinc-500/30 shadow-[0_0_50px_rgba(255,255,255,0.05)]"
  };

  const glowColor = {
    emerald: "rgba(16,185,129,0.15)",
    amber: "rgba(245,158,11,0.15)",
    zinc: "rgba(255,255,255,0.1)"
  };

  return (
    <div 
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className={`w-full max-w-3xl h-[75vh] border bg-black rounded-lg flex flex-col overflow-hidden font-mono transition-all duration-500 ${themeColors[theme]}`}>
        {/* Terminal Header */}
        <div className={`border-b p-2.5 flex items-center justify-between ${theme === 'amber' ? 'bg-amber-500/10 border-amber-500/30' : theme === 'zinc' ? 'bg-zinc-500/10 border-zinc-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
          <div className="flex items-center gap-2 text-sm">
            <Terminal size={16} />
            <span className="font-bold tracking-tighter opacity-80 uppercase">achyuth@os:~</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:opacity-60 transition-opacity p-1">
            <X size={18} />
          </button>
        </div>
        
        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className={`flex-1 overflow-y-auto p-5 space-y-2.5 text-sm sm:text-base terminal-scrollbar ${theme === 'amber' ? 'text-amber-500/90' : theme === 'zinc' ? 'text-zinc-400' : 'text-emerald-500/90'}`}
        >
          {history.map((line, i) => (
            <div key={i} className={`flex gap-3 whitespace-pre-wrap word-break ${line.type === 'error' ? 'text-red-400' : line.type === 'system' ? (theme === 'amber' ? 'text-amber-400/60' : theme === 'zinc' ? 'text-zinc-500' : 'text-emerald-400/60') + ' font-bold italic' : ''}`}>
              {line.type === 'input' ? (
                <>
                  <span className="shrink-0 opacity-70">achyuth@os:~$</span>
                  <span className="text-white font-bold">{line.text}</span>
                </>
              ) : (
                <div className="opacity-95 leading-relaxed flex-1">{line.text}</div>
              )}
            </div>
          ))}
          
          <form onSubmit={handleCommand} className="flex gap-2 items-center mt-3 group">
            <span className="opacity-70">achyuth@os:~$</span>
            <input 
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-white font-bold cursor-text shadow-none"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
      
      <style>{`
        .terminal-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .terminal-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb {
          background: ${glowColor[theme]};
          border-radius: 10px;
        }
        .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'amber' ? 'rgba(245,158,11,0.3)' : theme === 'zinc' ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.3)'};
        }
      `}</style>
    </div>
  );
}
