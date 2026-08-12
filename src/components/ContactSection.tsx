import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Send, Linkedin, Github, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import MagneticButton from "./ui/MagneticButton";
import { SectionHeader } from "./ui/SectionHeader";


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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      const validated = contactFormSchema.parse(formData);
      setErrors({}); // Clear errors on success

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
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        
        toast({
          title: "Validation Error",
          description: "Please check the highlighted fields.",
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
      <div className="absolute inset-0 opacity-0 group-hover/contact:opacity-100 transition-opacity duration-1000 pointer-events-none z-0 will-change-transform"
           style={{
             background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(16, 185, 129, 0.03) 0%, transparent 40%)'
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
        <SectionHeader 
          label="Contact"
          titleMain="Let's"
          titleAccent="Talk"
          description="Recruiting, engineering roles, or a systems question — email gets the fastest response, usually within a day."
          align="left"
        />

        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Contact Info: Communication Nodes */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 6, scale: 1.01 }}
                className="flex items-center gap-6 p-7 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm hover:bg-emerald-500/[0.04] hover:border-emerald-500/20 transition-all duration-500 group/item relative overflow-hidden"
              >
                {/* Subtle background glow on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/[0.06] to-transparent opacity-0 group-hover/item:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />
                
                {/* Elegant left accent line */}
                <div className="absolute left-0 top-[20%] bottom-[20%] w-[2px] rounded-full bg-emerald-500/0 group-hover/item:bg-emerald-500/60 group-hover/item:shadow-[0_0_8px_rgba(16,185,129,0.4)] transition-all duration-500" />
                
                {/* Icon container with glow */}
                <div className="relative w-12 h-12 rounded-lg flex items-center justify-center border border-white/[0.08] bg-white/[0.03] text-white/30 group-hover/item:text-emerald-400 group-hover/item:border-emerald-500/30 group-hover/item:bg-emerald-500/[0.08] group-hover/item:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-500">
                   <item.icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 relative z-10">
                  <span className="text-[10px] font-mono text-white/15 uppercase tracking-[0.3em] group-hover/item:text-emerald-400/50 transition-colors duration-500">
                    {item.label}_CHANNEL
                  </span>
                  <p className="text-white/80 font-display text-lg md:text-xl font-semibold tracking-tight group-hover/item:text-white transition-colors duration-300">{item.value}</p>
                </div>

                {/* Hover arrow indicator */}
                <div className="text-white/0 group-hover/item:text-emerald-400/60 transition-all duration-500 transform translate-x-2 group-hover/item:translate-x-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
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
                    <label htmlFor="name" className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 group-focus-within:text-emerald-400 transition-colors">
                      <span>{'>'} IDENTITY_VERIFICATION</span>
                      <span className="text-[10px] opacity-20">AUTH_REQ</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white font-display focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all duration-500 placeholder:text-white/10 aria-[invalid=true]:border-red-500/50 aria-[invalid=true]:focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                      placeholder="ENTER_SENDER_NAME"
                    />
                    {errors.name && (
                      <span id="name-error" className="text-red-400 text-[10px] font-mono mt-2 block" role="alert">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="group">
                    <label htmlFor="email" className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 group-focus-within:text-emerald-400 transition-colors">
                      <span>{'>'} RETURN_ADDRESS</span>
                      <span className="text-[10px] opacity-20">IPV6_LINK</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      required
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white font-display focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] transition-all duration-500 placeholder:text-white/10 aria-[invalid=true]:border-red-500/50 aria-[invalid=true]:focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                      placeholder="USER@HOST.COM"
                    />
                    {errors.email && (
                      <span id="email-error" className="text-red-400 text-[10px] font-mono mt-2 block" role="alert">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="message" className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4 group-focus-within:text-emerald-400 transition-colors">
                    <span>{'>'} PACKET_DATA_STREAM</span>
                    <span className="text-[10px] opacity-20">LZW_COMPRESSED</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    rows={6}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-5 py-4 text-white font-display focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.1)] resize-none transition-all duration-500 placeholder:text-white/10 aria-[invalid=true]:border-red-500/50 aria-[invalid=true]:focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
                    placeholder="INITIATING_MESSAGE_PAYLOAD..."
                  />
                  {errors.message && (
                    <span id="message-error" className="text-red-400 text-[10px] font-mono mt-2 block" role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-6 bg-white text-black font-mono text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-emerald-400 transition-all duration-500 flex items-center justify-center gap-4 relative overflow-hidden group/btn rounded-lg"
                >
                  <div className="absolute inset-0 bg-white group-hover/btn:bg-emerald-400 transition-colors" />
                  {/* Ripple overlay */}
                  <div className="absolute inset-0 pointer-events-none" />
                  <span className="relative z-10 flex items-center gap-3">
                    EXECUTE_TRANSMISSION <Send className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 pointer-events-none" />
                </motion.button>
              </div>

              {/* Decorative side lines */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
