import { motion } from "framer-motion";
import { Github, Linkedin, Mail, FileText, Heart } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "https://github.com/achyuthkp27", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/kpachyuth", label: "LinkedIn" },
    { icon: Mail, href: "mailto:kpachyuthz@gmail.com", label: "Email" },
    { icon: FileText, href: "https://medium.com/@kpachyuthz", label: "Medium" },
  ];

  return (
    <footer className="relative py-12 px-6 md:px-12 bg-transparent">
      {/* Horizontal Light Saber Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10 overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-[200px] bg-gradient-to-r from-transparent via-white to-transparent animate-scan-beam-horizontal" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <a href="#" className="font-display text-lg font-bold tracking-tight text-white uppercase">
            ACHYUTH<span className="text-white/40">.DEV</span>
          </a>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            © {new Date().getFullYear()} // SYSTEM_ONLINE
          </p>
        </div>

        <div className="flex items-center gap-6">
          {socialLinks.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              className="text-xs font-mono text-white/50 hover:text-white uppercase tracking-wider transition-colors"
            >
              [{link.label}]
            </motion.a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
