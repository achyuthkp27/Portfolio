import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MapPin, Send, Linkedin, Github, FileText, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import TextReveal from "./ui/TextReveal";
import ParallaxSection from "./ui/ParallaxSection";
import MagneticButton from "./ui/MagneticButton";

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validated = contactFormSchema.parse(formData);

      // Construct Mailto link
      const subject = `Portfolio Contact: ${validated.name}`;
      const body = `Name: ${validated.name}\nEmail: ${validated.email}\n\nMessage:\n${validated.message}`;
      const mailtoUrl = `mailto:kpachyuthz@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.location.href = mailtoUrl;

      toast({
        title: "Opening Email Client",
        description: "Please send the pre-filled email to verify your contact request.",
        variant: "default",
      });

      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "kpachyuthz@gmail.com",
      href: "mailto:kpachyuthz@gmail.com",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/kpachyuth",
      href: "https://linkedin.com/in/kpachyuth",
    },
    {
      icon: Github,
      label: "GitHub",
      value: "github.com/achyuthkp27",
      href: "https://github.com/achyuthkp27",
    },
    {
      icon: FileText,
      label: "Blog",
      value: "medium.com/@kpachyuthz",
      href: "https://medium.com/@kpachyuthz",
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent group/contact" ref={ref}>
      {/* Dynamic Cursor Spotlight Effect */}
      <div className="absolute inset-0 opacity-0 group-hover/contact:opacity-100 transition-opacity duration-1000 pointer-events-none z-0"
           style={{
             background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 255, 0.03) 0%, transparent 40%)'
           }} 
           onMouseMove={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const x = ((e.clientX - rect.left) / rect.width) * 100;
             const y = ((e.clientY - rect.top) / rect.height) * 100;
             e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
             e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
           }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
          <div>
            <TextReveal type="fade-up">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-400 border border-emerald-500/20 mb-8 bg-emerald-500/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SATELLITE_UPLINK // ESTABLISHED
              </span>
            </TextReveal>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter uppercase leading-none">
              <TextReveal type="blur-reveal" delay={0.2} as="span">Initiate</TextReveal><br/>
              <TextReveal type="blur-reveal" delay={0.4} as="span" className="text-white/40">Contact</TextReveal>
            </h2>
          </div>
          <div className="max-w-sm text-right">
            <TextReveal type="fade-up" delay={0.6} className="text-[11px] font-mono text-white/30 uppercase tracking-[0.2em] leading-relaxed">
              Establishing a high-bandwidth frequency for neural collaboration. Secure protocols active. Ready for packet transmission.
            </TextReveal>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Contact Info: Communication Nodes */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-6 p-8 border border-white/10 bg-black/40 hover:bg-white/[0.02] hover:border-cyan-500/30 transition-all duration-700 group/item relative overflow-hidden"
              >
                {/* Horizontal Scan Effect */}
                <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-cyan-500 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-[600%] transition-all duration-[1.5s] ease-in-out pointer-events-none" />
                
                <div className="w-14 h-14 flex items-center justify-center border border-white/10 bg-white/5 text-white/40 group-hover:text-cyan-400 group-hover:border-cyan-500/50 transition-all duration-500 relative">
                   {/* Mechanical corner decor */}
                   <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-cyan-400 transition-colors" />
                   <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-cyan-400 transition-colors" />
                   <item.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] group-hover/item:text-cyan-500/60 transition-colors">
                      {item.label}_CHANNEL
                    </span>
                  </div>
                  <p className="text-white font-display text-xl md:text-2xl font-bold tracking-tighter group-hover/item:text-white/90 transition-colors">{item.value}</p>
                </div>
              </motion.a>
            ))}

            <div className="pt-8 border-t border-white/5">
                <div className="flex items-center gap-4 px-4 py-3 bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   STATUS: ENCRYPTION_ACTIVE // 4096-BIT_RSA
                </div>
            </div>
          </div>

          {/* Contact Form: Encrypted Uplink */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="relative p-10 border border-white/10 bg-black/60 backdrop-blur-xl rounded-2xl overflow-hidden group/form shadow-2xl"
            >
              <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />
              
              <div className="space-y-12 relative z-10">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="group">
                    <label htmlFor="name" className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 group-focus-within:text-cyan-400 transition-colors">
                      <span>{'>'} IDENTITY_VERIFICATION</span>
                      <span className="text-[8px] opacity-20">AUTH_REQ</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white font-display focus:outline-none focus:border-cyan-500/50 transition-all duration-500 placeholder:text-white/5"
                      placeholder="ENTER_SENDER_NAME"
                    />
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 group-focus-within:text-cyan-400 transition-colors">
                      <span>{'>'} RETURN_ADDRESS</span>
                      <span className="text-[8px] opacity-20">IPV6_LINK</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white font-display focus:outline-none focus:border-cyan-500/50 transition-all duration-500 placeholder:text-white/5"
                      placeholder="USER@HOST.COM"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="message" className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 group-focus-within:text-cyan-400 transition-colors">
                    <span>{'>'} PACKET_DATA_STREAM</span>
                    <span className="text-[8px] opacity-20">LZW_COMPRESSED</span>
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white font-display focus:outline-none focus:border-cyan-500/50 resize-none transition-all duration-500 placeholder:text-white/5"
                    placeholder="INITIATING_MESSAGE_PAYLOAD..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 bg-white text-black font-mono text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-white group-hover/btn:bg-cyan-400 transition-colors" />
                  <span className="relative z-10 flex items-center gap-3">
                    EXECUTE_TRANSMISSION <Send className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </div>

              {/* Decorative side lines */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
