import { motion } from "framer-motion";

const SystemStatus = () => {
    return (
        <div className="w-full bg-transparent overflow-hidden py-3 select-none">
            <div className="flex items-center gap-12 whitespace-nowrap">
                {/* Infinite Marquee Wrapper */}
                <motion.div
                    className="flex items-center gap-12"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    {/* Repeated Content Block 1 */}
                    <ContentBlock />
                    {/* Repeated Content Block 2 */}
                    <ContentBlock />
                    {/* Repeated Content Block 3 */}
                    <ContentBlock />
                    {/* Repeated Content Block 4 */}
                    <ContentBlock />
                </motion.div>
            </div>
        </div>
    );
};

const ContentBlock = () => (
    <>
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/55 uppercase">
            JAVA // SPRING BOOT // KAFKA
        </span>
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse"></span>
            BANKING_MICROSERVICES
        </span>
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/55 uppercase">
            AKP | BACKEND_ENGINEER
        </span>
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/55 uppercase">
             /// BLR
        </span>
        <span className="text-[10px] font-mono tracking-[0.2em] text-white/55 uppercase">
            SINCE 2021
        </span>
    </>
)

export default SystemStatus;
