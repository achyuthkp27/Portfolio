import { useState, useEffect, useRef } from "react";
import { Terminal, X } from "lucide-react";

export default function TerminalOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<{ type: 'input' | 'output'; text: string }[]>([
    { type: 'output', text: 'Welcome to ACHYUTH_OS v2.4.1' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        setIsOpen(true);
        keyBuffer = "";
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: 'input' as const, text: input }];
    
    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'output', text: 'Available commands: help, whoami, clear, exit, sudo, matrix' });
        break;
      case 'whoami':
        newHistory.push({ type: 'output', text: 'guest_user' });
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
        newHistory.push({ type: 'output', text: 'nice try. user not in sudoers file. this incident will be reported.' });
        break;
      case 'matrix':
        newHistory.push({ type: 'output', text: 'Follow the white rabbit...' });
        break;
      default:
        newHistory.push({ type: 'output', text: `Command not found: ${cmd}` });
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
            <div key={i} className="flex gap-2 whitespace-pre-wrap word-break">
              {line.type === 'input' ? (
                <>
                  <span className="text-green-500">guest@achyuth_os:~$</span>
                  <span className="text-white font-bold">{line.text}</span>
                </>
              ) : (
                <span className="opacity-80">{line.text}</span>
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
