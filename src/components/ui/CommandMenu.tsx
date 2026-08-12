import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { Home, Briefcase, Mail, FileText, Code, User, Monitor, Terminal, Palette, Check } from "lucide-react";
import { useAnalytics } from "@/lib/analytics";

import "@/styles/themes.css";
import { useSmoothScroll } from "@/components/ui/SmoothScroll";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("emerald");
  const navigate = useNavigate();
  const posthog = useAnalytics();
  const { lenis } = useSmoothScroll();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    // Load initial theme
    const savedTheme = localStorage.getItem("portfolio-theme") || "emerald";
    setActiveTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      lenis?.stop();
    } else {
      document.body.style.overflow = 'unset';
      lenis?.start();
    }
    return () => { 
      document.body.style.overflow = 'unset';
      lenis?.start();
    };
  }, [open, lenis]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    setActiveTheme(theme);
    setOpen(false);
    posthog?.capture('theme_changed', { theme_id: theme });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onWheel={(e) => e.stopPropagation()} data-command-menu>
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl overflow-hidden">
        <Command label="Global Command Menu" className="w-full text-white">
          <Command.Input 
            autoFocus 
            placeholder="Type a command or search..." 
            className="w-full border-b border-white/10 bg-transparent p-4 text-sm outline-none placeholder:text-white/40" 
          />
          <Command.List className="max-h-[400px] overflow-y-auto p-2" style={{ overscrollBehavior: 'contain' }}>
            <Command.Empty className="p-4 text-center text-sm text-white/50 font-mono">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-xs font-mono text-white/40 px-2 pt-3 pb-1 uppercase tracking-wider">
              <Command.Item onSelect={() => runCommand(() => { navigate("/"); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100); })} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <Home className="h-4 w-4" /> Home
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => { navigate("/"); setTimeout(() => document.getElementById("projects")?.scrollIntoView(), 100); })} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <Code className="h-4 w-4" /> Projects
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => { navigate("/"); setTimeout(() => document.getElementById("experience")?.scrollIntoView(), 100); })} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <Briefcase className="h-4 w-4" /> Experience
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => { navigate("/"); setTimeout(() => document.getElementById("contact")?.scrollIntoView(), 100); })} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <Mail className="h-4 w-4" /> Contact
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-1 h-px bg-white/10" />

            <Command.Group heading="Themes" className="text-xs font-mono text-white/40 px-2 pt-3 pb-1 uppercase tracking-wider">
              <Command.Item onSelect={() => setTheme('emerald')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'emerald' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Monitor className="h-4 w-4" /> Default (Emerald)
                {activeTheme === 'emerald' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
              <Command.Item onSelect={() => setTheme('titan')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'titan' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Monitor className="h-4 w-4" /> Titan (Monochrome)
                {activeTheme === 'titan' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
              <Command.Item onSelect={() => setTheme('light')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'light' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Monitor className="h-4 w-4" /> Light (Clean)
                {activeTheme === 'light' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
              <Command.Item onSelect={() => setTheme('dracula')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'dracula' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Palette className="h-4 w-4" /> Dracula (IDE Classic)
                {activeTheme === 'dracula' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
              <Command.Item onSelect={() => setTheme('nord')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'nord' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Palette className="h-4 w-4" /> Nord (Arctic Minimal)
                {activeTheme === 'nord' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
              <Command.Item onSelect={() => setTheme('cyberpunk')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'cyberpunk' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Terminal className="h-4 w-4" /> Cyberpunk Edge
                {activeTheme === 'cyberpunk' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
              <Command.Item onSelect={() => setTheme('midnight')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'midnight' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Monitor className="h-4 w-4" /> Midnight (Modern SaaS)
                {activeTheme === 'midnight' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
              <Command.Item onSelect={() => setTheme('solarized')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'solarized' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Terminal className="h-4 w-4" /> Solarized Dark
                {activeTheme === 'solarized' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
              <Command.Item onSelect={() => setTheme('matrix')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'matrix' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Terminal className="h-4 w-4" /> Matrix Protocol
                {activeTheme === 'matrix' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
              <Command.Item onSelect={() => setTheme('synthwave')} className={`flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors aria-selected:bg-white/10 ${activeTheme === 'synthwave' ? 'text-emerald-400 bg-white/5' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>
                <Palette className="h-4 w-4" /> Synthwave 1984
                {activeTheme === 'synthwave' && <Check className="h-4 w-4 ml-auto" />}
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-1 h-px bg-white/10" />

            <Command.Group heading="Actions" className="text-xs font-mono text-white/40 px-2 pt-3 pb-1 uppercase tracking-wider">
              <Command.Item onSelect={() => runCommand(() => { const a = document.createElement('a'); a.href = '/Achyuth KP_Resume.pdf'; a.download = 'Achyuth_KP_Resume.pdf'; a.click(); })} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <User className="h-4 w-4" /> Download Resume
              </Command.Item>
            </Command.Group>
            
          </Command.List>
        </Command>
      </div>
      <div className="absolute inset-0 z-[-1]" onClick={() => setOpen(false)} />
    </div>
  );
}
