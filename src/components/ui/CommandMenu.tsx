import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import { Home, Briefcase, Mail, FileText, Code, User } from "lucide-react";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl border border-white/10 bg-black/90 shadow-2xl overflow-hidden">
        <Command label="Global Command Menu" className="w-full text-white">
          <Command.Input 
            autoFocus 
            placeholder="Type a command or search..." 
            className="w-full border-b border-white/10 bg-transparent p-4 text-sm outline-none placeholder:text-white/40" 
          />
          <Command.List className="max-h-[300px] overflow-y-auto p-2 no-scrollbar">
            <Command.Empty className="p-4 text-center text-sm text-white/50 font-mono">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="text-xs font-mono text-white/40 px-2 pt-3 pb-1 uppercase tracking-wider">
              <Command.Item onSelect={() => runCommand(() => navigate("/"))} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <Home className="h-4 w-4" /> Home
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => { navigate("/"); setTimeout(() => document.getElementById("projects")?.scrollIntoView(), 100); })} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <Code className="h-4 w-4" /> Projects
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => { navigate("/"); setTimeout(() => document.getElementById("experience")?.scrollIntoView(), 100); })} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <Briefcase className="h-4 w-4" /> Experience
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => navigate("/blog"))} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <FileText className="h-4 w-4" /> Blog
              </Command.Item>
              <Command.Item onSelect={() => runCommand(() => { navigate("/"); setTimeout(() => document.getElementById("contact")?.scrollIntoView(), 100); })} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
                <Mail className="h-4 w-4" /> Contact
              </Command.Item>
            </Command.Group>

            <Command.Separator className="my-1 h-px bg-white/10" />

            <Command.Group heading="Actions" className="text-xs font-mono text-white/40 px-2 pt-3 pb-1 uppercase tracking-wider">
              <Command.Item onSelect={() => runCommand(() => window.open("https://achyuthkp.com/resume.pdf", "_blank"))} className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors aria-selected:bg-white/10">
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
