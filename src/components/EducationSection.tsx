import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { GraduationCap, MapPin, Calendar } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";
import ParallaxSection from "./ui/ParallaxSection";
import TextReveal from "./ui/TextReveal";

const EducationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Pre-compute random barcode widths/opacities to avoid render instability
  const barcodeValues = useMemo(() =>
    [...Array(6)].map(() => ({
      width: Math.random() * 60 + 40,
      opacity: Math.random() * 0.5 + 0.2,
    })), []
  );

  return (
    <section id="education" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>

      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader 
          label="[ ACADEMIC_RECORD ]" 
          titleMain="EDUCATION" 
          titleAccent="HISTORY" 
          align="center"
        />

        <ParallaxSection speed={0.2}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="relative group/edu">
              {/* Outer Glow on hover */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-transparent blur-2xl opacity-0 group-hover/edu:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative p-1 bg-black/60 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group-hover/edu:border-blue-500/30 transition-all duration-700">
                
                {/* Top LED Indicator Line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-transparent opacity-30 group-hover/edu:opacity-100 transition-opacity duration-500" />

                {/* Massive Watermark */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 text-[150px] font-display font-bold text-white/[0.02] pointer-events-none tracking-tighter select-none rotate-[-10deg] md:rotate-0 pr-10">
                  SSIT
                </div>
                
                {/* Tech Grid Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-10" />

                <div className="relative flex flex-col md:flex-row gap-8 items-start p-8 md:p-12 z-10">
                  
                  {/* Left Column: Icon & 'Barcode' */}
                  <div className="flex flex-col gap-6 flex-shrink-0">
                    <div className="w-20 h-20 relative flex items-center justify-center rounded-xl bg-gradient-to-b from-blue-500/10 to-transparent border border-blue-500/20 group-hover/edu:border-blue-400/50 group-hover/edu:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500">
                      <div className="absolute inset-0 bg-blue-500/5 pulse-animation rounded-xl" />
                      <GraduationCap className="w-8 h-8 text-blue-400 relative z-10" />
                    </div>
                    
                    {/* Simulated Fingerprint / Barcode block */}
                    <div className="flex flex-col gap-1 w-20">
                      {barcodeValues.map((bar, i) => (
                        <div 
                          key={i} 
                          className="h-1 bg-blue-500/30 rounded-full" 
                          style={{ width: `${bar.width}%`, opacity: bar.opacity }}
                        />
                      ))}
                      <span className="text-[10px] font-mono text-blue-400/50 mt-2 text-center uppercase tracking-widest">
                        SYS.ID_21
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Content */}
                  <div className="flex-1 w-full pl-0 md:pl-6 md:border-l border-white/5 relative">
                    {/* Hover Line reveal on the border */}
                    <div className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-blue-500 via-cyan-400 to-transparent scale-y-0 group-hover/edu:scale-y-100 origin-top transition-transform duration-700 hidden md:block" />

                    <TextReveal type="fade-up" delay={0.2}>
                      <span className="inline-block px-3 py-1 text-[10px] font-mono border border-blue-500/30 text-blue-400 rounded bg-blue-500/10 uppercase tracking-[0.2em] mb-4">
                        B.E._2017–2021
                      </span>
                    </TextReveal>

                    <h3 className="font-display text-2xl md:text-4xl font-bold mb-3 text-white uppercase tracking-tight group-hover/edu:text-blue-50 transition-colors">
                      Bachelor of Engineering
                    </h3>
                    
                    <div className="font-mono text-xs md:text-sm text-blue-200/60 uppercase tracking-widest mb-6">
                      {'>'} Computer Science & Engineering
                    </div>

                    <div className="flex flex-wrap gap-4 md:gap-6 mb-8 text-gray-400 text-xs font-mono uppercase tracking-widest">
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span>S.S.I.T. INDIA</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>2017 – 2021</span>
                      </div>
                    </div>

                    <p className="text-gray-400 leading-relaxed text-sm max-w-2xl text-justify border-t border-white/5 pt-6 relative group-hover/edu:text-gray-300 transition-colors">
                      B.E. in Computer Science and Engineering from Sri Siddhartha Institute of Technology, Tumakuru — data structures, operating systems, databases, and the fundamentals that five years of banking systems have been built on since.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </ParallaxSection>
      </div>
    </section>
  );
};

export default EducationSection;
