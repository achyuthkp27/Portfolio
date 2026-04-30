import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Mail, FileText } from "lucide-react";

const Footer = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const socialLinks = [
    { icon: Github, href: "https://github.com/achyuthkp27", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/kpachyuth", label: "LinkedIn" },
    { icon: Mail, href: "mailto:kpachyuthz@gmail.com", label: "Email" },
    { icon: FileText, href: "https://medium.com/@kpachyuthz", label: "Medium" },
  ];

  return (
    <footer className="relative py-12 px-6 md:px-12 bg-transparent" ref={ref}>
      {/* Animated gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full w-[200px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
          initial={{ x: "-200px" }}
          animate={isInView ? { x: "calc(100vw + 200px)" } : {}}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <a href="#" className="font-display text-lg font-bold tracking-tight text-white uppercase">
            ACHYUTH<span className="text-white/40">.DEV</span>
          </a>
          <p className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
            © {new Date().getFullYear()} // SYSTEM_ONLINE
          </p>
        </div>

        {/* Colophon */}
        <div className="hidden md:flex items-center gap-2 text-[9px] font-mono text-white/40 uppercase tracking-widest">
          <span>BUILT_WITH</span>
          <span className="text-white/20">|</span>
          {["React", "Vite", "Tailwind", "Framer Motion"].map((tech, i) => (
            <span key={tech} className="text-white/50 hover:text-white/80 transition-colors cursor-default">
              {tech}{i < 3 ? " ·" : ""}
            </span>
          ))}
        </div>

        {/* Animated social links */}
        <div className="flex items-center gap-4">
          {socialLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -3, scale: 1.1 }}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300"
            >
              <link.icon className="w-4 h-4" />
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
