import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { Code2, Server, Cloud, Zap } from "lucide-react";

const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  const skills = [
    { category: "Development", items: ["React", "TypeScript", "Node.js", "Next.js"] },
    { category: "Design", items: ["Figma", "UI/UX", "Motion Design", "Branding"] },
    { category: "Tools", items: ["Git", "AWS", "Docker", "Tailwind"] },
  ];

  const stats = [
    { value: "5+", label: "Years Experience" },
    { value: "50+", label: "Projects Completed" },
    { value: "30+", label: "Happy Clients" },
  ];

  const highlights = [
    { icon: Code2, label: "Architecture", value: "Clean Code" },
    { icon: Server, label: "25+ Services", value: "Microservices" },
    { icon: Cloud, label: "AWS Expert", value: "Cloud Native" },
    { icon: Zap, label: "Optimized", value: "Performance" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    },
  };

  return (
    <section id="about" className="py-32 px-6 md:px-12 relative overflow-hidden bg-black" ref={ref}>
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      <motion.div style={{ opacity, scale }} className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-16 lg:gap-24"
        >
          {/* Left column */}
          <div className="space-y-12">
            <motion.div variants={itemVariants}>
              <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-8 bg-white/5">
                [ PROFILE_DATA ]
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight text-white tracking-tight">
                TURNING IDEAS INTO
                <br />
                <span className="text-white/40">DIGITAL REALITY</span>
              </h2>
            </motion.div>

            <div className="space-y-6">
              <motion.p variants={itemVariants} className="text-gray-400 leading-relaxed text-lg border-l-2 border-white/20 pl-6">
                I'm a passionate creative developer with a love for building beautiful,
                functional websites and applications. With expertise spanning both design
                and development, I bring a unique perspective to every project.
              </motion.p>

              <motion.p variants={itemVariants} className="text-gray-500 leading-relaxed pl-6 text-sm">
                My approach combines clean code with thoughtful design, creating experiences
                that not only look stunning but also perform flawlessly. I believe in the
                power of attention to detail and user-centered design.
              </motion.p>

              {/* Highlights Grid Restoration */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pt-4">
                {highlights.map((item) => (
                  <div key={item.label} className="p-4 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                    <item.icon className="w-5 h-5 text-white mb-2" />
                    <div className="font-display font-bold text-white text-sm uppercase">{item.value}</div>
                    <div className="text-[10px] text-white/50 font-mono uppercase tracking-wider">{item.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <div className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-white/40 font-mono">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right column - Skills */}
          <div className="space-y-6">
            {skills.map((skillGroup, groupIndex) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + groupIndex * 0.15 }}
                className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white mb-6 flex items-center gap-4">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 + groupIndex * 0.15 + skillIndex * 0.05 }}
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                      className="px-3 py-1 text-[10px] font-mono border border-white/10 text-white/60 uppercase tracking-wider cursor-default transition-colors"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default About;
