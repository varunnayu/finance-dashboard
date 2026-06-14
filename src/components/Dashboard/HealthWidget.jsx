import React from "react";
import { motion } from "framer-motion";
import { Activity, Shield } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";

const HealthWidget = () => {
    const { transactions } = useFinance();

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    let score = 50;

    if (income > expense) score += 30;

    if (income > 0 && (income - expense) / income > 0.2)
        score += 20;

    // Circumference for r=36 is 2 * pi * 36 = 226.19
    const circumference = 226.19;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let scoreColor = "text-rose-500 dark:text-rose-400";
    let strokeColor = "#f43f5e"; // rose-500
    let statusText = "Needs Improvement";
    let statusDesc = "Your spending behavior indicates high outflow. Try setting budget boundaries.";

    if (score >= 80) {
        scoreColor = "text-emerald-500 dark:text-emerald-400";
        strokeColor = "#10b981"; // emerald-500
        statusText = "Excellent";
        statusDesc = "Superb financial management! You maintain strong cash reserves.";
    } else if (score >= 60) {
        scoreColor = "text-amber-500 dark:text-amber-400";
        strokeColor = "#f59e0b"; // amber-500
        statusText = "Good";
        statusDesc = "Healthy budget margins. Standard guidelines are followed.";
    }

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.005 }}
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
                xs:flex-row
                gap-6
                items-center
                justify-between
            "
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-indigo-600" />
            
            {/* Ambient background glow */}
            <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-20 bg-emerald-500 pointer-events-none" />

            <div className="space-y-3 flex-1 min-w-0 text-center xs:text-left relative z-10">
                <div className="flex items-center justify-center xs:justify-start gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Real-time Health Check</span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white">
                    Financial Health Index
                </h3>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Status: <span className={`${scoreColor} font-black`}>{statusText}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                    {statusDesc}
                </p>
            </div>

            <div className="relative flex-shrink-0 flex items-center justify-center w-32 h-32 relative z-10">
                {/* SVG Gauge */}
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="64"
                        cy="64"
                        r="36"
                        className="stroke-slate-200 dark:stroke-slate-800/80"
                        strokeWidth="8"
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="64"
                        cy="64"
                        r="36"
                        stroke={strokeColor}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: strokeDashoffset }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                        {score}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                        Score
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default HealthWidget;