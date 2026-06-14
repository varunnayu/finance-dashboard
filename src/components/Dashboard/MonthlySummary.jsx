import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, PiggyBank, Percent } from "lucide-react";

const MonthlySummary = () => {
    const { income, expense, balance } = useFinance();

    const savingsRate =
        income > 0
            ? ((balance / income) * 100).toFixed(1)
            : 0;

    const cards = [
        {
            label: "Total Income",
            value: `₹${income.toLocaleString("en-IN")}`,
            color: "text-emerald-500 dark:text-emerald-400",
            bg: "bg-emerald-500/10 dark:bg-emerald-500/20",
            icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
            border: "border-emerald-500/20",
        },
        {
            label: "Total Expenses",
            value: `₹${expense.toLocaleString("en-IN")}`,
            color: "text-rose-500 dark:text-rose-400",
            bg: "bg-rose-500/10 dark:bg-rose-500/20",
            icon: <TrendingDown className="w-5 h-5 text-rose-500" />,
            border: "border-rose-500/20",
        },
        {
            label: "Net Savings",
            value: `₹${balance.toLocaleString("en-IN")}`,
            color: "text-indigo-500 dark:text-indigo-400",
            bg: "bg-indigo-500/10 dark:bg-indigo-500/20",
            icon: <PiggyBank className="w-5 h-5 text-indigo-500" />,
            border: "border-indigo-500/20",
        },
        {
            label: "Savings Quotient",
            value: `${savingsRate}%`,
            color: "text-purple-500 dark:text-purple-400",
            bg: "bg-purple-500/10 dark:bg-purple-500/20",
            icon: <Percent className="w-5 h-5 text-purple-500" />,
            border: "border-purple-500/20",
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-ping" />
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Quick Summary Ledger
                </h3>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        whileHover={{ y: -3, scale: 1.01 }}
                        className={`
                            glass-panel
                            relative
                            overflow-hidden
                            p-5
                            border
                            border-slate-200/40
                            dark:border-white/5
                            hover:border-slate-300/50
                            dark:hover:border-white/10
                            group
                            flex
                            items-center
                            justify-between
                            gap-3
                        `}
                    >
                        <div className="space-y-1 min-w-0">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block truncate">
                                {card.label}
                            </span>
                            <h2 className={`text-xl sm:text-2xl font-black ${card.color} truncate tracking-tight`}>
                                {card.value}
                            </h2>
                        </div>
                        
                        <div className={`p-2.5 rounded-xl ${card.bg} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                            {card.icon}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MonthlySummary;