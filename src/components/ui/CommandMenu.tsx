import { useEffect, useRef, useState } from "react";
import { Command } from "cmdk";
import { Home, Briefcase, Mail, Code, User, Terminal, FileDown, GitBranch } from "lucide-react";
import { OPEN_COMMAND_MENU_EVENT, openTerminal } from "@/lib/shortcuts";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { PROFILE } from "@/data/profile";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";

import { useSmoothScroll } from "@/context/smoothScroll";

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

  useScrollLock(open, lenis);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  // Works from any page: navigates home first and waits for the section to mount
  const goTo = (id: string) => runCommand(() => scrollToSection(id));

  const downloadResume = () =>
    runCommand(() => {
      const a = document.createElement("a");
      a.href = `${import.meta.env.BASE_URL}${PROFILE.resume}`;
      a.download = PROFILE.resumeDownloadName;
      a.click();
    });

  if (!open) return null;

  const itemClass =
    "flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2.5 font-body text-sm text-snow/80 transition-colors duration-fast aria-selected:bg-snow/[0.08] aria-selected:text-snow";
  const groupClass =
    "px-2 pb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-body [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.15em] [&_[cmdk-group-heading]]:text-muted";

  const sections: { id: string; label: string; icon: typeof Home }[] = [
    { id: "top", label: "Home", icon: Home },
    { id: "about", label: "About", icon: User },
    { id: "work", label: "Work", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "open-source", label: "Open source", icon: GitBranch },
    { id: "contact", label: "Contact", icon: Mail },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-night/60 p-4 pt-[18vh] animate-in fade-in duration-150"
      onWheel={(e) => e.stopPropagation()}
      data-command-menu
      role="dialog"
      aria-modal="true"
      aria-label="Quick menu"
      data-lenis-prevent
      ref={dialogRef}
    >
      <div className="absolute inset-0" onClick={() => setOpen(false)} aria-hidden="true" />
      <div className="relative w-full max-w-lg rounded-lg border border-line bg-tile shadow-[0_30px_80px_hsl(0_0%_0%/0.8)] overflow-hidden">
        <Command label="Quick menu" className="w-full text-snow">
          <Command.Input
            autoFocus
            placeholder="Where to?"
            className="w-full border-b border-line bg-transparent px-5 py-4 font-body text-[15px] text-snow outline-none placeholder:text-muted"
          />
          <Command.List className="max-h-[380px] overflow-y-auto py-2" style={{ overscrollBehavior: "contain" }}>
            <Command.Empty className="px-5 py-6 text-center font-body text-sm text-muted">No matches.</Command.Empty>

            <Command.Group heading="Go to" className={groupClass}>
              {sections.map(({ id, label, icon: Icon }) => (
                <Command.Item key={id} value={label} onSelect={() => goTo(id)} className={itemClass}>
                  <Icon className="h-4 w-4 text-muted" aria-hidden="true" /> {label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Separator className="mx-4 my-1 h-px bg-line" />

            <Command.Group heading="Actions" className={groupClass}>
              <Command.Item value="Download résumé resume" onSelect={downloadResume} className={itemClass}>
                <FileDown className="h-4 w-4 text-muted" aria-hidden="true" /> Download résumé
              </Command.Item>
              <Command.Item value="Open terminal" onSelect={() => runCommand(openTerminal)} className={itemClass}>
                <Terminal className="h-4 w-4 text-muted" aria-hidden="true" /> Open terminal
                <kbd className="ml-auto inline-flex h-6 min-w-6 items-center justify-center rounded-sm border border-line px-1.5 font-mono text-snow/80">
                  <span className="text-lg leading-none translate-y-[3px]">`</span>
                </kbd>
              </Command.Item>
            </Command.Group>
          </Command.List>
          <div className="flex items-center justify-between border-t border-line px-5 py-2.5 font-body text-xs text-muted">
            <span>↑↓ to move · Enter to open</span>
            <span>Esc to close</span>
          </div>
        </Command>
      </div>
    </div>
  );
}
