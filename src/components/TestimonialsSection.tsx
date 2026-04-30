import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SpotlightCard from "./ui/SpotlightCard";
import { SectionHeader } from "./ui/SectionHeader";

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "CTO, FinTech Sol",
        content: "Achyuth's expertise in microservices architecture significantly improved our system's scalability and performance.",
        company: "FinTech Sol (Client)"
    },
    {
        name: "David Chen",
        role: "Product Manager",
        content: "Delivered a complex dashboard with exceptional attention to detail.",
        company: "DataFlow Inc (Client)"
    },
    {
        name: "Elena Rodriguez",
        role: "Startup Founder",
        content: "Rapid delivery of a production-ready MVP that exceeded our expectations.",
        company: "Nexus AI (Client)"
    },
];

const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="py-20 lg:py-24 px-6 md:px-12 relative overflow-hidden bg-transparent">

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <SectionHeader 
                        label="[ SOCIAL_PROOF ]" 
                        titleMain="Trusted By" 
                        titleAccent="Industry Leaders" 
                        align="center"
                    />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            className="h-full"
                        >
                            <SpotlightCard
                                className="h-full flex flex-col p-8 border border-white/10 bg-black/40 glass-card"
                                spotlightColor="rgba(255, 255, 255, 0.1)"
                            >
                                <Quote className="w-8 h-8 text-white/20 mb-6 group-hover:text-white/40 transition-colors" />
                                <p className="text-gray-300 mb-6 leading-relaxed flex-grow">"{item.content}"</p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10" />
                                    <div>
                                        <div className="text-white font-bold text-sm">{item.name}</div>
                                        <div className="text-white/40 text-xs font-mono uppercase tracking-wider">{item.role}</div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
