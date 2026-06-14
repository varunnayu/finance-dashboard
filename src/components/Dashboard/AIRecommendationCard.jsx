import React from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";

const AIRecommendationCard = () => {
    const { transactions } = useFinance();

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const savings = income - expense;

    let recommendation = "Start adding transactions to receive AI insights.";
    let type = "info"; // info, warning, success
    let icon = <Sparkles className="w-5 h-5 text-indigo-500" />;
    let badgeText = "AI Suggestion";

    if (transactions.length > 0) {
        if (expense > income) {
            recommendation = "Your expenses exceed your income. Consider reducing discretionary spending to avoid debt.";
            type = "warning";
            icon = <AlertTriangle className="w-5 h-5 text-amber-500 animate-bounce" />;
            badgeText = "Budget Warning";
        } else if (savings > income * 0.3) {
            recommendation = "Excellent savings rate! Consider allocating part of your surplus (₹" + savings + ") to investments or debt repayment.";
            type = "success";
            icon = <CheckCircle className="w-5 h-5 text-emerald-500" />;
            badgeText = "Savings Success";
        } else {
            recommendation = "Your finances look balanced. Continue tracking expenses regularly to build a stable emergency fund.";
            type = "info";
            icon = <TrendingUp className="w-5 h-5 text-indigo-500" />;
            badgeText = "Balanced Health";
        }
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
            "
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-indigo-600" />
            
            {/* Ambient background glow */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-20 bg-indigo-500 pointer-events-none" />

            <div className="flex gap-4 items-start relative z-10">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/40 dark:border-white/5 shadow-inner">
                    {icon}
                </div>
                
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                            {badgeText}
                        </span>
                    </div>
                    <h3 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-1.5">
                        AI Recommendation
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {recommendation}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default AIRecommendationCard;