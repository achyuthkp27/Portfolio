import { useEffect, useRef, useState } from "react";
import { Command } from "cmdk";
import { Home, Briefcase, Mail, Code, User, Terminal, FileDown } from "lucide-react";
import { OPEN_COMMAND_MENU_EVENT, openTerminal } from "@/lib/shortcuts";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useFocusTrap } from "@/hooks/useFocusTrap";

import { useSmoothScroll } from "@/components/ui/SmoothScroll";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const scrollToSection = useSectionScroll();
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(dialogRef, open);
  const { lenis } = useSmoothScroll();

  // ⌘K / Ctrl+K toggles, Escape closes, and the nav badge can open it
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const handleOpen = () => setOpen(true);

    document.addEventListener("keydown", down);
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, handleOpen);
    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, handleOpen);
    };
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

  // Works from any page: navigates home first and waits for the section to mount
  const goTo = (id: string) => runCommand(() => scrollToSection(id));

  const downloadResume = () =>
    runCommand(() => {
      const a = document.createElement("a");
      a.href = `${import.meta.env.BASE_URL}Achyuth KP_Resume.pdf`;
      a.download = "Achyuth_KP_Resume.pdf";
      a.click();
    });

  if (!open) return null;

  const itemClass =
    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm text-white/80 transition-colors aria-selected:bg-white/[0.08] aria-selected:text-white";
  const groupClass =
    "px-2 pb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-body [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em] [&_[cmdk-group-heading]]:text-white/45";

  const sections: { id: string; label: string; icon: typeof Home }[] = [
    { id: "top", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "projects", label: "Projects", icon: Code },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[18vh] animate-in fade-in duration-150"
      onWheel={(e) => e.stopPropagation()}
      data-command-menu
      role="dialog"
      aria-modal="true"
      aria-label="Quick menu"
      data-lenis-prevent
      ref={dialogRef}
    >
      <div className="absolute inset-0" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden">
        <Command label="Quick menu" className="w-full text-white">
          <Command.Input
            autoFocus
            placeholder="Where to?"
            className="w-full border-b border-white/10 bg-transparent px-5 py-4 font-body text-[15px] text-white outline-none placeholder:text-white/40"
          />
          <Command.List className="max-h-[380px] overflow-y-auto py-2" style={{ overscrollBehavior: "contain" }}>
            <Command.Empty className="px-5 py-6 text-center font-body text-sm text-white/55">No matches.</Command.Empty>

            <Command.Group heading="Go to" className={groupClass}>
              {sections.map(({ id, label, icon: Icon }) => (
                <Command.Item key={id} value={label} onSelect={() => goTo(id)} className={itemClass}>
                  <Icon className="h-4 w-4 text-white/50" aria-hidden="true" /> {label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="mx-4 my-1 h-px bg-white/10" />

            <Command.Group heading="Actions" className={groupClass}>
              <Command.Item value="Download résumé resume" onSelect={downloadResume} className={itemClass}>
                <FileDown className="h-4 w-4 text-white/50" aria-hidden="true" /> Download résumé
              </Command.Item>
              <Command.Item value="Open terminal" onSelect={() => runCommand(openTerminal)} className={itemClass}>
                <Terminal className="h-4 w-4 text-white/50" aria-hidden="true" /> Open terminal
                <kbd className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded border border-white/15 bg-white/[0.04] px-1.5 font-body text-white/80">
                  <span className="text-lg leading-none translate-y-[3px]">`</span>
                </kbd>
              </Command.Item>
            </Command.Group>
          </Command.List>
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-2.5 font-body text-xs text-white/45">
            <span>↑↓ to move · Enter to open</span>
            <span>Esc to close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
