import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import { Landmark, AlertCircle, Coins } from "lucide-react";

const BudgetStats = () => {
    const { budgets, transactions } = useFinance();

    const totalBudget = budgets.reduce(
        (sum, budget) => sum + Number(budget.amount),
        0
    );

    const totalSpent = transactions
        .filter((t) => t.type === "expense")
        .reduce(
            (sum, transaction) =>
                sum + Number(transaction.amount),
            0
        );

    const remaining = totalBudget - totalSpent;
    const progressPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    const stats = [
        {
            title: "Total Budget Allocation",
            amount: `₹${totalBudget.toLocaleString("en-IN")}`,
            icon: <Landmark className="w-5 h-5 text-indigo-500" />,
            color: "text-indigo-500 dark:text-indigo-400",
            border: "from-indigo-500 to-brand-500",
        },
        {
            title: "Spent Ledger Total",
            amount: `₹${totalSpent.toLocaleString("en-IN")}`,
            icon: <Coins className="w-5 h-5 text-rose-500" />,
            color: "text-rose-500 dark:text-rose-400",
            border: "from-rose-500 to-orange-500",
        },
        {
            title: "Remaining Allowance",
            amount: `₹${remaining.toLocaleString("en-IN")}`,
            icon: <AlertCircle className="w-5 h-5 text-emerald-500" />,
            color: remaining < 0 ? "text-red-500 dark:text-red-400" : "text-emerald-500 dark:text-emerald-400",
            border: remaining < 0 ? "from-red-500 to-rose-600" : "from-emerald-500 to-teal-500",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -3, scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="
                            glass-panel
                            relative
                            overflow-hidden
                            p-5
                            border
                            border-slate-200/40
                            dark:border-white/5
                            group
                            flex
                            items-center
                            justify-between
                        "
                    >
                        {/* Accent border stripe */}
                        <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${stat.border}`} />
                        
                        <div className="space-y-1 min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                                {stat.title}
                            </span>
                            <h2 className={`text-2xl font-black ${stat.color} tracking-tight truncate`}>
                                {stat.amount}
                            </h2>
                        </div>
                        
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/20 dark:border-white/5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            {stat.icon}
                        </div>
                    </motion.div>
                ))}
            </div>

            {totalBudget > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-5 border border-slate-200/40 dark:border-white/5 relative overflow-hidden"
                >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                        <span>Overall Budget Consumption</span>
                        <span className={progressPercent > 90 ? "text-rose-500" : progressPercent > 75 ? "text-amber-500" : "text-emerald-500"}>
                            {progressPercent.toFixed(1)}% Used
                        </span>
                    </div>
                    
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                                progressPercent > 90
                                    ? "from-rose-500 to-red-600"
                                    : progressPercent > 75
                                        ? "from-amber-400 to-orange-500"
                                        : "from-emerald-400 to-indigo-500"
                            }`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default BudgetStats;