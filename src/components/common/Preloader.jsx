import { motion } from "framer-motion";

const Preloader = () => {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                y: -40,
                filter: "blur(16px)",
                transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 flex items-center justify-center overflow-hidden bg-[#03050c] z-[9999]"
        >
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[140px]" />
            </div>

            {/* SVG Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            <div className="flex flex-col items-center max-w-sm px-6 text-center z-10">
                {/* Glowing Logo Container with Self-Drawing SVG */}
                <motion.div 
                    exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.45, ease: "easeIn" } }}
                    className="relative mb-8 flex items-center justify-center"
                >
                    {/* Ambient Glow */}
                    <div className="absolute w-24 h-24 rounded-full bg-brand-500/20 blur-xl animate-pulse" />
                    
                    <svg width="100" height="100" viewBox="0 0 80 80" fill="none" className="relative drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                        <defs>
                            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="50%" stopColor="#0ea5e9" />
                                <stop offset="100%" stopColor="#00f2fe" />
                            </linearGradient>
                        </defs>
                        
                        {/* Hexagon Border */}
                        <motion.polygon
                            points="40,10 66,25 66,55 40,70 14,55 14,25"
                            stroke="url(#logoGrad)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0.1 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.6, ease: "easeInOut" }}
                        />

                        {/* Letter F Stem */}
                        <motion.path
                            d="M 32 26 L 32 54"
                            stroke="#ffffff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 1.0, ease: "easeInOut" }}
                        />

                        {/* Letter F Top Bar */}
                        <motion.path
                            d="M 32 26 H 48"
                            stroke="#ffffff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.7, ease: "easeInOut" }}
                        />

                        {/* Letter F Middle Bar */}
                        <motion.path
                            d="M 32 38 H 42"
                            stroke="url(#logoGrad)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ delay: 1.0, duration: 0.6, ease: "easeInOut" }}
                        />
                    </svg>
                </motion.div>

                {/* Brand Details Container */}
                <motion.div
                    exit={{ y: -20, opacity: 0, transition: { duration: 0.45, ease: "easeIn" } }}
                    className="flex flex-col items-center"
                >
                    {/* Brand Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-2xl font-black tracking-widest text-white uppercase"
                    >
                        FinFlow
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="mt-3 text-[9px] font-extrabold tracking-[0.2em] uppercase text-indigo-300/40"
                    >
                        Securing transaction ledger
                    </motion.p>

                    {/* Precise Loader Track */}
                    <div className="mt-6 w-36 h-[2px] bg-slate-800/60 rounded-full overflow-hidden relative">
                        <motion.div
                            className="absolute top-0 bottom-0 bg-gradient-to-r from-brand-400 to-indigo-500 rounded-full"
                            initial={{ left: "-100%", right: "100%" }}
                            animate={{
                                left: ["-100%", "100%"],
                                right: ["100%", "-100%"],
                            }}
                            transition={{
                                duration: 1.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Preloader;