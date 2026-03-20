import { useState, useEffect, useRef } from "react";
import { Send, User, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
}

const INITIAL_MESSAGES: GuestbookEntry[] = [
  {
    id: "1",
    name: "Alex C.",
    message: "Love the terminal easter egg! Very cyberpunk.",
    date: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "2",
    name: "Sarah M.",
    message: "Incredible portfolio design. The animations are superb.",
    date: new Date(Date.now() - 172800000).toISOString()
  }
];

// Global audio context for performance and browser limits
let audioCtx: AudioContext | null = null;
const playTickSound = () => {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) {
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    // Creating a highly mechanical "tick" using two layers
    const t = audioCtx.currentTime;
    
    // Layer 1: The sharp, high-frequency "snap" (mimics the plastic/metal mechanism clicking)
    const snapOsc = audioCtx.createOscillator();
    const snapGain = audioCtx.createGain();
    snapOsc.type = 'sine';
    // Start very high and drop extremely fast (10ms)
    snapOsc.frequency.setValueAtTime(1000, t);
    snapOsc.frequency.exponentialRampToValueAtTime(100, t + 0.01);
    
    // Fast attack, extremely fast release (10ms)
    snapGain.gain.setValueAtTime(0, t);
    snapGain.gain.linearRampToValueAtTime(0.3, t + 0.001);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.01);
    
    snapOsc.connect(snapGain);
    snapGain.connect(audioCtx.destination);
    
    // Layer 2: The low-frequency body / thump (gives it the haptic feel)
    const thumpOsc = audioCtx.createOscillator();
    const thumpGain = audioCtx.createGain();
    thumpOsc.type = 'sine';
    // Steady low frequency
    thumpOsc.frequency.setValueAtTime(150, t);
    
    // Slightly longer release for the body (20ms)
    thumpGain.gain.setValueAtTime(0, t);
    thumpGain.gain.linearRampToValueAtTime(0.4, t + 0.001);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    
    thumpOsc.connect(thumpGain);
    thumpGain.connect(audioCtx.destination);
    
    // Start and stop both layers abruptly
    snapOsc.start(t);
    snapOsc.stop(t + 0.015);
    thumpOsc.start(t);
    thumpOsc.stop(t + 0.025);
  } catch (e) {
    // Ignore audio fail, fail silently if audio not allowed
  }
};

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_MESSAGES);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drumAngle, setDrumAngle] = useState(0);
  const cylinderRef = useRef<HTMLDivElement>(null);

  // Prevent default scrolling via non-passive native event listener
  useEffect(() => {
    const el = cylinderRef.current;
    if (!el) return;

    // Listen passively but we need to unlock audioContext
    const unlockAudio = () => {
        if (!audioCtx) {
            const Ctx = window.AudioContext || (window as any).webkitAudioContext;
            if (Ctx) audioCtx = new Ctx();
        }
        if (audioCtx?.state === 'suspended') {
            audioCtx.resume();
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation(); 
      
      // Calculate new angle, clamped between 0 and max angle based on items
      setDrumAngle((prev) => {
          const maxAngle = Math.max(0, (entries.length - 1) * 45); // 45 degrees per item
          let newAngle = prev + e.deltaY * 0.15;
          if (newAngle < -20) newAngle = -20;
          if (newAngle > maxAngle + 20) newAngle = maxAngle + 20;
          
          if (Math.round(prev / 45) !== Math.round(newAngle / 45)) {
              playTickSound();
          }

          return newAngle;
      });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [entries.length]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("portfolio_guestbook");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries(parsed);
        }
      } catch (e) {
        console.error("Failed to parse guestbook entries");
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      const newEntry: GuestbookEntry = {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        date: new Date().toISOString()
      };

      const newEntries = [newEntry, ...entries];
      setEntries(newEntries);
      localStorage.setItem("portfolio_guestbook", JSON.stringify(newEntries));
      
      setName("");
      setMessage("");
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="mb-12 flex items-center gap-4">
          <MessageSquare className="text-white/40 w-6 h-6" />
          <h2 className="font-display text-2xl font-bold text-white tracking-tight">
            Guestbook_
          </h2>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="p-6 border border-white/10 bg-black/40 space-y-6">
              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">
                    Alias
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={30}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/50 transition-colors placeholder:text-white/20"
                    placeholder="guest_user"
                  />
                </div>

                <div className="group relative">
                  <label className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">
                    Log Entry
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={100}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-white/50 resize-none transition-colors placeholder:text-white/20"
                    placeholder="Leave a trace..."
                  />
                  <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/30">
                    {message.length}/100
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !message.trim()}
                className="w-full py-3 bg-white/10 hover:bg-white text-white hover:text-black font-mono text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Transmitting..." : "Sign Guestbook"} <Send className="w-3 h-3" />
              </button>
            </form>
          </div>

          {/* Messages (3D Cylindrical Scroll) */}
          <div 
            ref={cylinderRef}
            className="md:col-span-3 h-[400px] relative w-full select-none touch-none cursor-grab active:cursor-grabbing overflow-hidden rounded-xl"
            style={{ perspective: 1000 }}
            onPointerDown={(e) => {
                const startY = e.clientY;
                const startAngle = drumAngle;
                
                // Pre-initialize audio context on click
                if (!audioCtx) {
                    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
                    if (Ctx) audioCtx = new Ctx();
                }
                if (audioCtx?.state === 'suspended') audioCtx.resume();
                
                let lastAngle = startAngle;

                const handlePointerMove = (moveEvent: PointerEvent) => {
                    const delta = moveEvent.clientY - startY;
                    const newAngle = startAngle + delta * 0.4;
                    if (Math.round(lastAngle / 45) !== Math.round(newAngle / 45)) {
                        playTickSound();
                    }
                    lastAngle = newAngle;
                    setDrumAngle(newAngle);
                };
                
                const handlePointerUp = () => {
                    window.removeEventListener('pointermove', handlePointerMove);
                    window.removeEventListener('pointerup', handlePointerUp);
                };
                
                window.addEventListener('pointermove', handlePointerMove);
                window.addEventListener('pointerup', handlePointerUp);
            }}
          >
            {entries.length === 0 ? (
              <div className="text-white/40 text-sm font-mono border border-white/10 border-dashed p-8 text-center rounded absolute inset-0 flex items-center justify-center">
                No entries found. Be the first to leave a trace.
              </div>
            ) : (
              <motion.div 
                className="w-full h-full absolute inset-0"
                style={{ 
                    transformStyle: 'preserve-3d',
                }}
                animate={{
                    rotateX: drumAngle
                }}
                transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 30, 
                    mass: 0.8
                }}
              >
                  {entries.map((entry, idx) => {
                      const anglePerItem = 45;
                      const itemAngle = idx * anglePerItem;
                      
                      // Calculate active state for styling (dimming non-active items)
                      const distanceFromActive = Math.abs(drumAngle - itemAngle);
                      // If distance is > 90, it's mostly behind the drum
                      const isVisible = distanceFromActive < 100;
                      
                      // Fade out items that are scrolled away
                      const opacity = Math.max(0, 1 - (distanceFromActive / 90));

                      return (
                        <div 
                          key={entry.id}
                          className="absolute left-0 right-0 top-1/2 -mt-[4.5rem] p-5 border border-white/10 bg-[#080808] rounded-xl flex items-start gap-4 shadow-2xl transition-colors"
                          style={{
                              // Stamp each card in a circle
                              transform: `rotateX(${-itemAngle}deg) translateZ(200px)`,
                              backfaceVisibility: "hidden",
                              opacity: isVisible ? opacity : 0,
                              pointerEvents: distanceFromActive < 20 ? 'auto' : 'none',
                              border: distanceFromActive < 15 ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)'
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                            <User className="w-5 h-5 text-white/60" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium text-base truncate">{entry.name}</span>
                              <span className="text-white/30 text-[10px] font-mono shrink-0">
                                {new Date(entry.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-white/70 text-sm leading-relaxed break-words font-light">
                              {entry.message}
                            </p>
                          </div>
                        </div>
                      );
                  })}
              </motion.div>
            )}
            
            {/* Overlay gradients for cylindrical masking */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none rounded-xl" />
          </div>

        </div>
      </div>
    </section>
  );
}
