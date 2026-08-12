import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, MapPin, Calendar } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";

const EducationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="education" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>
      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader
          label="Education"
          titleMain="Where It"
          titleAccent="Started"
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative rounded-2xl border border-white/10 bg-black/40 hover:border-white/20 transition-colors duration-500 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start p-8 md:p-12">
            <div className="w-16 h-16 rounded-xl border border-white/15 bg-white/[0.03] flex items-center justify-center shrink-0">
              <GraduationCap className="w-7 h-7 text-emerald-400" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="inline-block px-3 py-1 text-[11px] font-body font-medium border border-white/15 text-white/50 rounded-full uppercase tracking-[0.2em] mb-5">
                B.E. · 2017 – 2021
              </span>

              <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                Bachelor of Engineering
              </h3>
              <div className="font-body text-sm text-white/50 mb-6">
                Computer Science & Engineering
              </div>

              <div className="flex flex-wrap gap-3 mb-7 text-xs font-body text-white/50">
                <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Sri Siddhartha Institute of Technology, Tumakuru
                </span>
                <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  2017 – 2021
                </span>
              </div>

              <p className="text-white/50 font-body font-light leading-relaxed text-sm max-w-2xl border-t border-white/10 pt-6">
                Data structures, operating systems, and databases — the fundamentals
                that five years of banking systems have been built on since.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EducationSection;
