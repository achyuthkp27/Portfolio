import { useState, useEffect, useRef } from "react";
import { Terminal, X } from "lucide-react";
import { usePostHog } from 'posthog-js/react';

export default function TerminalOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<{ type: 'input' | 'output' | 'system' | 'error'; text: string | React.ReactNode }[]>([
    { type: 'system', text: 'Welcome to ACHYUTH_OS v2.4.1 [Secure Line]' },
    { type: 'system', text: 'Authorization recognized. Type "help" to view directory.' }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const posthog = usePostHog();

  // Key sequence detector for ">_"
  useEffect(() => {
    let keyBuffer = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      
      // Ignore modifier keys like "Shift", "Control", etc.
      if (e.key.length === 1) {
        keyBuffer += e.key;
        if (keyBuffer.length > 2) {
          keyBuffer = keyBuffer.slice(-2);
        }
      }
      
      if (keyBuffer === ">_") {
        e.preventDefault(); // Prevent '_' from being typed into the newly opened terminal
        setIsOpen(true);
        setInput(""); // Ensure the input is strictly empty when opening
        keyBuffer = "";
        
        posthog?.capture('terminal_opened', { 
            method: 'keyboard_shortcut' 
        });
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [posthog]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const fullCmd = input.trim();
    const cmd = fullCmd.toLowerCase().split(' ')[0];
    const args = fullCmd.split(' ').slice(1).join(' ');
    const newHistory = [...history, { type: 'input' as const, text: fullCmd }];
    
    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'output', text: (
            <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-1 my-2">
                <span className="text-emerald-400 font-bold">about</span><span>Who am I?</span>
                <span className="text-emerald-400 font-bold">skills</span><span>My technical arsenal</span>
                <span className="text-emerald-400 font-bold">projects</span><span>Classified builds & case studies</span>
                <span className="text-emerald-400 font-bold">contact</span><span>Establish a secure line</span>
                <span className="text-emerald-400 font-bold">clear</span><span>Wipe terminal history</span>
                <span className="text-emerald-400 font-bold">exit</span><span>Close secure connection</span>
                <span className="text-emerald-400 font-bold">sudo</span><span>Elevate privileges</span>
            </div>
        )});
        break;
      case 'about':
        newHistory.push({ type: 'output', text: (
            <div className="my-2 border-l-2 border-emerald-500/50 pl-4 py-1">
                <p className="font-bold text-white mb-1">Achyuth // Creative Developer</p>
                <p className="text-emerald-500/80 mb-2">Architecting systems, painting with pixels.</p>
                <p>I operate at the intersection of rigid logic and fluid creativity.</p>
                <p>Currently spinning up full-stack react applications and scaling infrastructure.</p>
            </div>
        )});
        break;
      case 'skills':
        newHistory.push({ type: 'output', text: (
            <div className="my-2 space-y-2">
                <div><span className="text-emerald-400 mr-2">Frontend_</span> React, Next.js, WebGL, Tailwind CSS, Framer Motion</div>
                <div><span className="text-emerald-400 mr-2">Backend_</span> Node.js, Spring Boot, Microservices</div>
                <div><span className="text-emerald-400 mr-2">Ops_</span> AWS, Docker, CI/CD, Linux Administration</div>
            </div>
        )});
        break;
      case 'projects':
        newHistory.push({ type: 'output', text: (
            <div className="my-2 space-y-1">
                <div><span className="text-white hover:underline cursor-pointer">1. E-Commerce Microservices</span> - [ Spring Boot, Kafka, React ]</div>
                <div><span className="text-white hover:underline cursor-pointer">2. 3D Generative Art engine</span> - [ Three.js, WebGL, React ]</div>
                <div><span className="text-white hover:underline cursor-pointer">3. Fintech Mobile App</span> - [ React Native, Node.js ]</div>
                <div className="text-emerald-500/50 text-xs mt-2 italic">Type 'cat projects.dir' for deep dive.</div>
            </div>
        )});
        break;
      case 'contact':
        newHistory.push({ type: 'system', text: 'INITIATING SECURE HANDSHAKE...' });
        newHistory.push({ type: 'output', text: (
            <div className="my-2">
                <div>Email: <a href="mailto:hello@achyuth.dev" className="text-emerald-400 underline">hello@achyuth.dev</a></div>
                <div>GitHub: <a href="https://github.com" target="_blank" rel="noreferrer" className="text-emerald-400 underline">github.com/achyuth</a></div>
                <div>Status: Accepting incoming transmissions.</div>
            </div>
        )});
        break;
      case 'whoami':
        newHistory.push({ type: 'output', text: 'guest_user (Clearance Level: 1)' });
        break;
      case 'ls':
        newHistory.push({ type: 'output', text: (
            <div className="flex gap-4 my-2 font-bold">
                <span className="text-white">about.txt</span>
                <span className="text-blue-400">projects.dir/</span>
                <span className="text-emerald-400">contact.sh*</span>
                <span className="text-red-400">secret.enc</span>
            </div>
        )});
        break;
      case 'cat':
        if (args === 'about.txt') newHistory.push({ type: 'output', text: 'Run the `about` command instead. It is prettier.' });
        else if (args === 'secret.enc') newHistory.push({ type: 'error', text: '[!] Permission Denied. Encryption protocol strictly enforced.' });
        else if (!args) newHistory.push({ type: 'error', text: 'Usage: cat <filename>' });
        else newHistory.push({ type: 'error', text: `cat: ${args}: No such file or directory` });
        break;
      case 'date':
        newHistory.push({ type: 'system', text: `SYSTEM_TIME: ${new Date().toISOString()}` });
        break;
      case 'echo':
        newHistory.push({ type: 'output', text: args });
        break;
      case 'ping':
        if (!args) newHistory.push({ type: 'error', text: 'Usage: ping <host>' });
        else newHistory.push({ type: 'output', text: `Pinging ${args}...\n64 bytes from ${args}: icmp_seq=1 ttl=116 time=24.5 ms\n64 bytes from ${args}: icmp_seq=2 ttl=116 time=22.1 ms` });
        break;
      case 'clear':
        setHistory([]);
        setInput("");
        return;
      case 'exit':
        setIsOpen(false);
        setInput("");
        return;
      case 'sudo':
        if (args === 'rm -rf /') {
            newHistory.push({ type: 'error', text: 'NICE TRY. SELF-DESTRUCT SEQUENCE ABORTED.' });
        } else {
            newHistory.push({ type: 'error', text: '[!] nice try. user not in sudoers file. this incident will be reported to the cyber police.' });
        }
        break;
      case 'matrix':
        newHistory.push({ type: 'system', text: 'Wake up, Neo...\nThe Matrix has you...\nFollow the white rabbit.' });
        break;
      default:
        newHistory.push({ type: 'error', text: `Command not found: ${cmd}. Type 'help' for directory.` });
    }

    setHistory(newHistory);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-3xl h-[60vh] border border-green-500/30 bg-black rounded-lg shadow-[0_0_30px_rgba(0,255,0,0.1)] flex flex-col overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="bg-green-500/10 border-b border-green-500/30 p-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-500 text-sm">
            <Terminal size={16} />
            <span>root@achyuth_os:~</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-green-500 hover:text-green-400 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        {/* Terminal Body */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 text-sm sm:text-base text-green-500/90"
        >
          {history.map((line, i) => (
            <div key={i} className={`flex gap-3 whitespace-pre-wrap word-break ${line.type === 'error' ? 'text-red-400' : line.type === 'system' ? 'text-emerald-400/60' : 'text-emerald-500/90'}`}>
              {line.type === 'input' ? (
                <>
                  <span className="text-emerald-500 shrink-0">guest@achyuth_os:~$</span>
                  <span className="text-white font-bold">{line.text}</span>
                </>
              ) : (
                <span className="opacity-90 leading-relaxed">{line.text}</span>
              )}
            </div>
          ))}
          
          <form onSubmit={handleCommand} className="flex gap-2 items-center mt-2 group">
            <span className="text-green-500">guest@achyuth_os:~$</span>
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
    </div>
  );
}
