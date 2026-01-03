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

      // Construct WhatsApp message
      const text = `*New Portfolio Contact*\n\n*Name:* ${validated.name}\n*Email:* ${validated.email}\n*Message:* ${validated.message}`;
      const encodedText = encodeURIComponent(text);

      // TODO: Replace with your actual WhatsApp number (International format without +)
      const phoneNumber = "919999999999";

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

      window.open(whatsappUrl, '_blank');

      toast({
        title: "Opening WhatsApp",
        description: "Please send the pre-filled message to verify your contact request.",
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
    <section id="contact" className="py-32 px-6 md:px-12 relative overflow-hidden bg-transparent" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <TextReveal type="fade-up">
            <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/10 mb-6 bg-white/5">
              [ COMM_UPLINK ]
            </span>
          </TextReveal>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            <TextReveal type="blur-reveal" delay={0.2} as="span">INITIATE</TextReveal>{" "}
            <TextReveal type="blur-reveal" delay={0.3} shouldSplit={false} as="span" className="text-white/40 inline-block">CONTACT</TextReveal>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((item, index) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-6 p-6 border border-white/10 bg-white/5 hover:border-white/30 transition-all group"
              >
                <div className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/60 group-hover:text-white transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-white font-display text-lg tracking-wide group-hover:text-white/80">{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="p-8 border border-white/10 bg-black/40 space-y-8"
          >
            <div className="space-y-6">
              <div className="group">
                <label htmlFor="name" className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">
                  Identify // Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white font-display tracking-wide focus:outline-none focus:border-white transition-colors placeholder:text-white/10"
                  placeholder="ENTER NAME"
                />
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">
                  Contact // Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white font-display tracking-wide focus:outline-none focus:border-white transition-colors placeholder:text-white/10"
                  placeholder="ENTER EMAIL"
                />
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">
                  Transmission // Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 py-3 text-white font-display tracking-wide focus:outline-none focus:border-white resize-none transition-colors placeholder:text-white/10"
                  placeholder="ENTER MESSAGE DATA..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              Send Transmission <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
