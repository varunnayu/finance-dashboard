import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldAlert as ShieldWarning } from "lucide-react";

const HealthScoreCard = ({
    score,
    status,
}) => {
    let strokeColor = "from-emerald-400 to-teal-500";
    let accentBorder = "from-emerald-500 to-teal-600";
    let badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15";
    let icon = <ShieldCheck className="text-emerald-500 w-6 h-6" />;
    let descText = "Your financial health parameters are excellent. Keep maintaining this level.";

    if (score < 60) {
        strokeColor = "from-rose-400 to-red-500";
        accentBorder = "from-rose-500 to-red-600";
        badgeStyle = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15";
        icon = <ShieldAlert className="text-rose-500 w-6 h-6 animate-pulse" />;
        descText = "Your financial status requires review. Outflows exceed recommended ratios.";
    } else if (score < 80) {
        strokeColor = "from-amber-400 to-orange-500";
        accentBorder = "from-amber-500 to-orange-600";
        badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15";
        icon = <ShieldWarning className="text-amber-500 w-6 h-6" />;
        descText = "Good health rating. You have moderate savings buffers but can optimize further.";
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3, scale: 1.002 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="
                glass-panel
                relative
                overflow-hidden
                p-6
                border
                border-slate-200/40
                dark:border-white/5
                group
                flex
                flex-col
                md:flex-row
                gap-6
                items-center
                justify-between
            "
        >
            {/* Top accent bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accentBorder}`} />
            
            {/* Ambient background glow */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-20 bg-indigo-500 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-4 flex-1 text-center md:text-left">
                <div className={`p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-md`}>
                    {icon}
                </div>
                <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
                            Financial Health Summary
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${badgeStyle}`}>
                            {status}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                        {descText}
                    </p>
                </div>
            </div>

            <div className="w-full md:w-56 space-y-2 flex-shrink-0">
                <div className="flex justify-between items-baseline text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">Health Index Score</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white">{score} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${strokeColor}`}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default HealthScoreCard;