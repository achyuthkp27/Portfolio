import { Fragment, useState, useEffect, useRef, useCallback } from "react";
import { Terminal, X } from "lucide-react";
import { useAnalytics } from "@/lib/analytics";
import { projects } from "@/data/projects";
import { fetchLatestRepositories, GitHubRepo } from "@/lib/github";

interface TerminalOverlayProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

type HistoryEntry = { type: 'input' | 'output' | 'system' | 'error'; text: string | React.ReactNode };

const CAREER_START = new Date("2021-07-26");

const COMMAND_LIST = [
  "help", "about", "skills", "projects", "gh", "socials", "neofetch",
  "theme", "diagnostics", "deploy", "resume", "contact", "timeline",
  "hack", "clear", "sudo", "exit",
];

const BOOT_LINES: { type: HistoryEntry['type']; text: string }[] = [
  { type: 'system', text: 'booting ACHYUTH_OS v2.4.1 …' },
  { type: 'system', text: 'mounting /career … ok' },
  { type: 'system', text: 'establishing secure line … ok' },
  { type: 'system', text: 'Authorization recognized. Type "help" to view directory.' },
];

const DEPLOY_LINES: { type: HistoryEntry['type']; text: string }[] = [
  { type: 'system', text: 'PIPELINE_TRIGGERED: release/prod' },
  { type: 'output', text: '[1/5] unit tests ........... 23 passed, 0 failed' },
  { type: 'output', text: '[2/5] build ................ dist/ ready (vite, 2.5s)' },
  { type: 'output', text: '[3/5] kafka consumers ...... rebalanced, lag 0' },
  { type: 'output', text: '[4/5] k8s rollout .......... 3/3 pods healthy' },
  { type: 'output', text: '[5/5] smoke checks ......... all endpoints 200' },
  { type: 'system', text: 'PROD IS GREEN. Ship it.' },
];

const MATRIX_CHARS = "アカサタナハマヤラワ0123456789ABCDEF$#@%&";

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
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [isBooting, setIsBooting] = useState(true);
  const [isRaining, setIsRaining] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const histIndexRef = useRef<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Every interval/timeout/raf is registered here and cleared on unmount
  const timersRef = useRef<{ intervals: Set<ReturnType<typeof setInterval>>; timeouts: Set<ReturnType<typeof setTimeout>>; rafs: Set<number> }>({
    intervals: new Set(), timeouts: new Set(), rafs: new Set(),
  });
  const posthog = useAnalytics();

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.intervals.forEach(clearInterval);
      timers.timeouts.forEach(clearTimeout);
      timers.rafs.forEach(cancelAnimationFrame);
    };
  }, []);

  const trackInterval = (id: ReturnType<typeof setInterval>) => { timersRef.current.intervals.add(id); return id; };
  const trackTimeout = (id: ReturnType<typeof setTimeout>) => { timersRef.current.timeouts.add(id); return id; };

  /** Append entries one by one on an interval — leak-free, closure-safe. */
  const streamLines = useCallback((lines: { type: HistoryEntry['type']; text: string }[], stepMs: number, onDone?: () => void) => {
    let i = 0;
    const id = setInterval(() => {
      if (i < lines.length) {
        const line = lines[i];
        setHistory(prev => [...prev, line]);
        i++;
      } else {
        clearInterval(id);
        timersRef.current.intervals.delete(id);
        onDone?.();
      }
    }, stepMs);
    trackInterval(id);
  }, []);

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  // Typed boot sequence — characters tick in across the boot script
  useEffect(() => {
    const script = BOOT_LINES;
    let line = 0;
    let char = 0;
    const id = setInterval(() => {
      if (line >= script.length) {
        clearInterval(id);
        timersRef.current.intervals.delete(id);
        setIsBooting(false);
        return;
      }
      char += 3;
      const done = script.slice(0, line).map(l => ({ type: l.type, text: l.text }));
      const current = { type: script[line].type, text: script[line].text.slice(0, char) };
      setHistory([...done, current]);
      if (char >= script[line].text.length) {
        line++;
        char = 0;
      }
    }, 16);
    trackInterval(id);
    return () => {
      clearInterval(id);
      timersRef.current.intervals.delete(id);
    };
  }, []);

  // Focus input once boot completes
  useEffect(() => {
    if (!isBooting) inputRef.current?.focus();
  }, [isBooting]);

  // Fetch GitHub repos on mount; abort if the terminal unmounts first
  useEffect(() => {
    const controller = new AbortController();
    fetchLatestRepositories(5, controller.signal).then((repos) => {
      if (!controller.signal.aborted) setGithubRepos(repos);
    });
    return () => controller.abort();
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
      const id = trackTimeout(setTimeout(() => inputRef.current?.focus(), 50));
      return () => { clearTimeout(id); document.body.style.overflow = ''; };
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

  // Matrix rain — brief canvas effect over the terminal body
  useEffect(() => {
    if (!isRaining || !canvasRef.current || !scrollRef.current) return;
    const canvas = canvasRef.current;
    const host = scrollRef.current;
    canvas.width = host.clientWidth;
    canvas.height = host.clientHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setIsRaining(false); return; }

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.floor(Math.random() * -20));
    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      if (t - last > 40) {
        last = t;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#34d399';
        ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < columns; i++) {
          const ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.97) drops[i] = 0;
          drops[i]++;
        }
      }
      raf = requestAnimationFrame(draw);
      timersRef.current.rafs.add(raf);
    };
    raf = requestAnimationFrame(draw);
    timersRef.current.rafs.add(raf);

    const stop = trackTimeout(setTimeout(() => {
      cancelAnimationFrame(raf);
      setIsRaining(false);
      setHistory(prev => [...prev, { type: 'system', text: 'just kidding — I build the defenses.' }]);
    }, 2400));

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(stop);
    };
  }, [isRaining]);

  const scrollToContact = () => {
    setIsOpen(false);
    // Deliberately untracked: fires after unmount but touches no React state —
    // it only scrolls the page once the overlay is gone.
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const handleCommand = useCallback((e?: React.FormEvent, manualCmd?: string) => {
    if (e) e.preventDefault();
    const rawInput = manualCmd || input;
    const trimmedInput = rawInput.trim();
    if (!trimmedInput) return;

    const fullCmd = trimmedInput;
    const cmd = fullCmd.toLowerCase().split(' ')[0];
    const args = fullCmd.split(' ').slice(1).join(' ');
    setCmdHistory(prev => (prev[prev.length - 1] === fullCmd ? prev : [...prev, fullCmd]));
    histIndexRef.current = -1;
    // Collect the entries this command produces, then append them with a
    // functional update so concurrent updates (e.g. streaming output)
    // are never clobbered by a stale `history` closure.
    const newHistory: HistoryEntry[] = [{ type: 'input', text: fullCmd }];

    const runCommand = (c: string) => handleCommandRef.current?.(undefined, c);

    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'output', text: (
            <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1 my-2 text-[12px] sm:text-sm">
                {[
                  ['about', 'Personnel bio & directives'],
                  ['skills', 'Technical weaponry'],
                  ['projects', 'Classified deployments'],
                  ['timeline', 'Career tree (ASCII)'],
                  ['gh', 'Sync GitHub repository nodes'],
                  ['deploy', 'Replay the release pipeline'],
                  ['resume', 'Download resume.pdf'],
                  ['contact', 'Open a secure mail channel'],
                  ['socials', 'External nodes (LinkedIn, Mail)'],
                  ['neofetch', 'System configuration overview'],
                  ['theme', 'Toggle UI color matrix'],
                  ['diagnostics', 'System health report'],
                  ['hack', 'Initialize breach simulation'],
                  ['clear', 'Flush buffer'],
                  ['exit', 'Terminate session'],
                ].map(([c, desc]) => (
                  <Fragment key={c}>
                    <button
                      type="button"
                      onClick={() => runCommand(c)}
                      className="text-emerald-400 font-bold text-left hover:underline cursor-pointer"
                    >
                      {c}
                    </button>
                    <span>{desc}</span>
                  </Fragment>
                ))}
            </div>
        )});
        break;
      case 'clear':
        setHistory([{ type: 'system', text: 'BUFFER_PURGED. SYSTEM_READY.' }]);
        setInput("");
        return;
      case 'about':
        newHistory.push({ type: 'output', text: 'IDENTITY: ACHYUTH KP\nROLE: SOFTWARE ENGINEER\nLOC: BENGALURU, IN\nFOCUS: BANKING MICROSERVICES & AI INTEGRATION\nEMAIL: kpachyuthz@gmail.com' });
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
      case 'timeline':
        newHistory.push({ type: 'output', text: (
            <pre className="my-2 text-[11px] sm:text-xs leading-relaxed whitespace-pre overflow-x-auto">{
`* 2026 ── cognizant · associate software engineer
│         merge: fis-global → cognizant (client rebadge)
* 2024 ── fis global · senior software engineer
│         tag: above-and-beyond-award (q1 2024)
* 2021 ── fis global · software engineer
│         retail · mobile · corporate banking
* 2020 ── aniworks · software development intern
│
* init ── b.e. computer science, class of 2021`
            }</pre>
        )});
        break;
      case 'deploy':
        setHistory(prev => [...prev, ...newHistory]);
        setInput("");
        streamLines(DEPLOY_LINES, 450);
        return;
      case 'resume': {
        newHistory.push({ type: 'system', text: 'FETCHING RESUME.PDF … download started.' });
        const a = document.createElement('a');
        a.href = `${import.meta.env.BASE_URL}Achyuth KP_Resume.pdf`;
        a.download = 'Achyuth_KP_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        break;
      }
      case 'contact':
        newHistory.push({ type: 'system', text: 'OPENING SECURE MAIL CHANNEL → kpachyuthz@gmail.com' });
        window.location.href = 'mailto:kpachyuthz@gmail.com';
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
      case 'neofetch': {
        const uptimeYears = ((Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000)).toFixed(1);
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
                    <div className="text-xs">Uptime: {uptimeYears} years (banking-grade)</div>
                    <div className="text-xs">Terminal: matrix-{theme}</div>
                </div>
            </div>
        )});
        break;
      }
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
      case 'hack':
        setHistory(prev => [...prev, ...newHistory, { type: 'system', text: 'INITIALIZING_BREACH_SEQUENCE…' }]);
        setInput("");
        setIsRaining(true);
        return;
      case 'exit':
        setIsOpen(false);
        setInput("");
        return;
      case 'sudo':
        if (args === 'hire-me') {
            newHistory.push({ type: 'system', text: 'ACCESS GRANTED. Escalating to recruiter privileges…' });
            newHistory.push({ type: 'output', text: 'Redirecting you to the contact desk. Bring an offer letter.' });
            setHistory(prev => [...prev, ...newHistory]);
            setInput("");
            trackTimeout(setTimeout(scrollToContact, 1400));
            return;
        } else if (args === 'rm -rf /') {
            newHistory.push({ type: 'error', text: 'NICE TRY. SELF-DESTRUCT SEQUENCE ABORTED.' });
        } else {
            newHistory.push({ type: 'error', text: '[!] nice try. user not in sudoers file. (hint: sudo hire-me)' });
        }
        break;
      default:
        newHistory.push({ type: 'error', text: `Command not found: ${cmd}. Type 'help' for directory.` });
    }

    setHistory(prev => [...prev, ...newHistory]);
    setInput("");
     
  }, [input, githubRepos, theme, streamLines]);

  // Stable ref so clickable help commands always call the latest handler
  const handleCommandRef = useRef<typeof handleCommand>();
  useEffect(() => { handleCommandRef.current = handleCommand; }, [handleCommand]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = histIndexRef.current === -1
        ? cmdHistory.length - 1
        : Math.max(0, histIndexRef.current - 1);
      histIndexRef.current = next;
      setInput(cmdHistory[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndexRef.current === -1) return;
      const next = histIndexRef.current + 1;
      if (next >= cmdHistory.length) {
        histIndexRef.current = -1;
        setInput("");
      } else {
        histIndexRef.current = next;
        setInput(cmdHistory[next]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = input.trimStart().toLowerCase();
      if (!current) return;
      const matches = COMMAND_LIST.filter(c => c.startsWith(current));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        setHistory(prev => [...prev, { type: 'system', text: matches.join('   ') }]);
      }
    }
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
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={scrollRef}
            className={`h-full overflow-y-auto p-5 space-y-2.5 text-sm sm:text-base terminal-scrollbar ${theme === 'amber' ? 'text-amber-500/90' : theme === 'zinc' ? 'text-zinc-400' : 'text-emerald-500/90'}`}
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

            {!isBooting && (
              <form onSubmit={handleCommand} className="flex gap-2 items-center mt-3 group">
                <span className="opacity-70">achyuth@os:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="flex-1 bg-transparent outline-none border-none text-white font-bold cursor-text shadow-none"
                  autoComplete="off"
                  spellCheck="false"
                  aria-label="Terminal command input"
                />
              </form>
            )}
          </div>

          {/* Matrix rain overlay */}
          {isRaining && (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
            />
          )}
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
