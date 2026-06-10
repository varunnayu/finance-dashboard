import React from "react";
import { motion } from "framer-motion";

const StatCard = ({
    title,
    amount,
    icon,
    bgColor = "from-blue-500 to-indigo-600",
}) => {
    // Determine glows and colors based on class names passed in bgColor
    let spotColor = "rgba(99, 102, 241, 0.15)";
    let iconBg = "bg-brand-500/10 text-brand-500 dark:bg-brand-500/20 dark:text-brand-400";
    let trend = "+12% this month";
    
    if (bgColor.includes("green") || bgColor.includes("emerald")) {
        spotColor = "rgba(16, 185, 129, 0.15)";
        iconBg = "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-400";
        trend = "+8% from last week";
    } else if (bgColor.includes("red") || bgColor.includes("rose")) {
        spotColor = "rgba(244, 63, 94, 0.15)";
        iconBg = "bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400";
        trend = "Increased spending";
    } else if (bgColor.includes("purple") || bgColor.includes("violet")) {
        spotColor = "rgba(168, 85, 247, 0.15)";
        iconBg = "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400";
        trend = "+15% growth rate";
    } else if (bgColor.includes("blue") || bgColor.includes("indigo")) {
        spotColor = "rgba(59, 130, 246, 0.15)";
        iconBg = "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400";
        trend = "Maintained balance";
    }

    // Extract the gradient classes if present to apply as top border line
    const gradientColors = bgColor.replace("bg-gradient-to-r", "").trim();

    return (
        <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="
                glass-panel
                relative
                overflow-hidden
                p-4
                sm:p-6
                flex
                flex-col
                justify-between
                shadow-lg
                hover:shadow-2xl
                border
                border-slate-200/40
                dark:border-white/5
                group
            "
        >
            {/* Liquid Glow spotlight */}
            <div 
                className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none pointer-events-none"
                style={{ backgroundColor: spotColor }}
            />

            {/* Glowing top line */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${gradientColors || "from-brand-500 to-indigo-500"}`} />

            <div className="flex justify-between items-start mb-2 sm:mb-4 relative z-10">
                <div className="min-w-0 flex-1 pr-1.5">
                    <span className="text-[9px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                        {title}
                    </span>
                    <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold mt-0.5 sm:mt-1 tracking-tight text-slate-800 dark:text-white truncate">
                        ₹{Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </h2>
                </div>

                <div className={`
                    w-9
                    h-9
                    sm:w-12
                    sm:h-12
                    rounded-xl
                    sm:rounded-2xl
                    flex
                    items-center
                    justify-center
                    text-sm
                    sm:text-xl
                    flex-shrink-0
                    transition-transform
                    duration-300
                    group-hover:scale-110
                    ${iconBg}
                `}>
                    {icon}
                </div>
            </div>

            {/* Micro-spark status indicator */}
            <div className="flex items-center justify-between text-[9px] sm:text-xs text-slate-400 dark:text-slate-500 relative z-10 border-t border-slate-100/50 dark:border-white/5 pt-2.5 sm:pt-3.5 mt-1.5 sm:mt-2">
                <span className={`font-semibold ${
                    bgColor.includes("red") ? "text-rose-500" : "text-emerald-500"
                } truncate max-w-[70%]`}>
                    {trend}
                </span>
                <span className="flex-shrink-0 hidden xs:inline">Updated</span>
            </div>
        </motion.div>
    );
};

export default StatCard;