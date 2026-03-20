import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TextReveal from "./ui/TextReveal";

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
  },
  {
    id: "3",
    name: "Elena R.",
    message: "The attention to detail in the micro-interactions is phenomenal. Truly inspiring work.",
    date: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: "4",
    name: "Marcus V.",
    message: "A masterclass in modern web aesthetics. Love the dark mode execution and the glassmorphism effects.",
    date: new Date(Date.now() - 345600000).toISOString()
  },
  {
    id: "5",
    name: "Jordan K.",
    message: "Clean code, cleaner UI. One of the best developer portfolios I've come across this year.",
    date: new Date(Date.now() - 432000000).toISOString()
  },
  {
    id: "6",
    name: "Satoshi N.",
    message: "System integrity confirmed. The grid-pattern background and tactical UI elements are a nice touch.",
    date: new Date(Date.now() - 518400000).toISOString()
  },
  {
    id: "7",
    name: "Liam S.",
    message: "The attention to detail in the micro-animations is next level. Everything feels so responsive.",
    date: new Date(Date.now() - 604800000).toISOString()
  },
  {
    id: "8",
    name: "Ava D.",
    message: "One of the most unique developer portfolios I've seen. Love the immersive aesthetic.",
    date: new Date(Date.now() - 691200000).toISOString()
  },
  {
    id: "9",
    name: "Noah W.",
    message: "The performance is impressive given the level of animation. Great engineering work here.",
    date: new Date(Date.now() - 777600000).toISOString()
  },
  {
    id: "10",
    name: "Sophia L.",
    message: "The 'Case Files' theme is so well-executed. Moving between sections feels like an investigation.",
    date: new Date(Date.now() - 864000000).toISOString()
  },
  {
    id: "11",
    name: "Ethan B.",
    message: "Clean architecture, clean design. A true inspiration for other developers in the field.",
    date: new Date(Date.now() - 950400000).toISOString()
  },
  {
    id: "12",
    name: "Isabella G.",
    message: "Love how responsive the entire interface is. Works perfectly on my mobile and tablet.",
    date: new Date(Date.now() - 1036800000).toISOString()
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
    <section id="guestbook" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-5 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-12">
          <div>
            <TextReveal type="fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-400 border border-emerald-500/20 mb-6 bg-emerald-500/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SECURE_CHANNEL // DATA_TRACE
              </span>
            </TextReveal>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter uppercase leading-none">
              <TextReveal type="blur-reveal" delay={0.2} as="span">Guest</TextReveal><br/>
              <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40">book</TextReveal>
            </h2>
          </div>
          <div className="max-w-xs text-right">
            <TextReveal type="fade-up" delay={0.6} className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] leading-relaxed">
              Inject your credentials into the neural archive. Leave a permanent trace in the system hierarchy.
            </TextReveal>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          
          {/* Form: Data Injection Port */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="relative p-8 border border-white/10 bg-black/60 rounded-2xl overflow-hidden group/form shadow-2xl backdrop-blur-md">
              {/* Scanning Line Animation */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-20 -top-full group-hover/form:top-full transition-all duration-[2000ms] pointer-events-none" />
              
              <div className="space-y-8 relative z-10">
                <div className="group">
                  <label className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-cyan-400 transition-colors">
                    <span>{'>'} SOURCE_ID</span>
                    <span className="text-[8px] opacity-0 group-focus-within:opacity-100 transition-opacity">REQUIRED</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={30}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all duration-500 placeholder:text-white/10 placeholder:font-mono"
                      placeholder="ENTER_ALIAS..."
                    />
                    <div className="absolute inset-0 rounded-lg bg-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-sm" />
                  </div>
                </div>

                <div className="group relative">
                  <label className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3 group-focus-within:text-cyan-400 transition-colors">
                    <span>{'>'} PACKET_PAYLOAD</span>
                    <span className="text-[8px] opacity-0 group-focus-within:opacity-100 transition-opacity">ENCRYPTED</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      maxLength={100}
                      rows={4}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none transition-all duration-500 placeholder:text-white/10 placeholder:font-mono mb-2"
                      placeholder="INITIATING_TRACE_INPUT..."
                    />
                    <div className="absolute inset-0 rounded-lg bg-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none blur-sm" />
                    <div className="flex justify-between items-center text-[9px] font-mono text-white/20 px-1 uppercase tracking-widest">
                      <span>STATUS: READY</span>
                      <span>{message.length}/100 BITS</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !message.trim()}
                className="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-500 hover:border-cyan-400 text-white font-mono text-[11px] uppercase tracking-[0.3em] transition-all duration-500 flex flex-col items-center justify-center gap-1 disabled:opacity-30 disabled:cursor-not-allowed group/btn overflow-hidden relative"
              >
                {/* Submit Pulse Effect */}
                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                
                <span className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? "TRANSMITTING_PACKETS..." : "ENCRYPT & TRANSMIT"} 
                  <Send className={`w-3.5 h-3.5 transition-transform duration-500 ${isSubmitting ? 'translate-x-[200px] opacity-0' : 'group-hover/btn:translate-x-1'}`} />
                </span>

                {isSubmitting && (
                  <div className="absolute bottom-0 left-0 h-1 bg-white animate-[progress-grow_0.6s_ease-in-out_infinite]" style={{ width: '100%' }} />
                )}
              </button>
            </form>
          </div>

          {/* Messages (3D Cylindrical Scroll) */}
          <div 
            ref={cylinderRef}
            className="md:col-span-3 h-[400px] relative w-full select-none touch-none cursor-grab active:cursor-grabbing rounded-xl"
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
                          className="absolute left-6 right-6 lg:left-10 lg:right-10 top-1/2 -mt-[4.5rem] p-6 border bg-black/80 backdrop-blur-xl rounded-2xl flex items-start gap-6 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-700 group/card"
                          style={{
                              transform: `rotateX(${-itemAngle}deg) translateZ(160px)`,
                              backfaceVisibility: "hidden",
                              opacity: isVisible ? opacity : 0,
                              pointerEvents: distanceFromActive < 20 ? 'auto' : 'none',
                              border: distanceFromActive < 15 ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(255,255,255,0.05)'
                          }}
                        >


                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex flex-col">
                                <span className="text-white font-display font-bold text-lg uppercase tracking-tight group-hover/card:text-cyan-400 transition-colors">
                                  {entry.name}
                                </span>
                                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">
                                  AUTH_ID: {entry.id.slice(-6)}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="block text-cyan-500/60 text-[10px] font-mono uppercase tracking-widest mb-1 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                                  VERIFIED
                                </span>
                                <span className="text-white/30 text-[9px] font-mono">
                                  [{new Date(entry.date).toLocaleDateString()}]
                                </span>
                              </div>
                            </div>
                            
                            <div className="relative">
                                {/* Quote mark accent */}
                                <div className="absolute -left-2 -top-1 text-cyan-500/20 text-3xl font-serif">"</div>
                                <p className="text-white/60 text-sm md:text-base leading-relaxed break-words font-light pl-3 relative z-10 group-hover/card:text-white/90 transition-colors italic">
                                  {entry.message}
                                </p>
                            </div>
                          </div>

                          {/* Top edge trace effect */}
                          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent scale-x-0 group-hover/card:scale-x-150 transition-transform duration-1000" />
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
