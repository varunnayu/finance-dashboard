import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import { Sparkles, HelpCircle } from "lucide-react";

const BudgetRecommendation = () => {
    const { budgets, transactions } = useFinance();

    if (budgets.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-500" />
                <div className="flex gap-4 items-start">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500">
                        <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="space-y-1 text-xs">
                        <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">
                            AI Budget Advisor
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                            No budgets defined yet. Select a category and enter a budget limit above to enable real-time optimization suggestions.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    const topBudget = budgets[0];

    const spent = transactions
        .filter(
            (t) =>
                t.type === "expense" &&
                t.category.toLowerCase().trim() === topBudget.category.toLowerCase().trim()
        )
        .reduce(
            (sum, t) =>
                sum + Number(t.amount),
            0
        );

    const suggestedLimit = Math.round(topBudget.amount * 0.9);
    const isOver = spent > suggestedLimit;

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="
                glass-panel 
                p-6 
                border 
                border-slate-200/40 
                dark:border-white/5 
                relative 
                overflow-hidden 
                bg-gradient-to-br 
                from-indigo-500/5 
                to-purple-500/5
            "
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-600" />
            
            {/* Ambient glow */}
            <div className="absolute -right-12 -bottom-12 w-36 h-36 rounded-full bg-purple-500 blur-3xl opacity-20 pointer-events-none" />

            <div className="flex gap-4 items-start relative z-10">
                <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 text-white shadow-md shadow-brand-500/15">
                    <Sparkles className="w-5 h-5" />
                </div>
                
                <div className="space-y-2 flex-1 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">AI Budget Advisor</span>
                    <h3 className="font-extrabold text-sm text-slate-800 dark:text-white capitalize">
                        Target Optimization: {topBudget.category}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isOver ? (
                            <span>
                                You have consumed ₹{spent.toLocaleString()} in <strong className="text-indigo-500 capitalize">{topBudget.category}</strong>. 
                                Spending exceeds our optimized threshold of <strong>₹{suggestedLimit.toLocaleString()}</strong>. Consider pausing non-essential purchases here.
                            </span>
                        ) : (
                            <span>
                                Category spending for <strong className="text-indigo-500 capitalize">{topBudget.category}</strong> is ₹{spent.toLocaleString()}. 
                                To maximize your savings target, we recommend maintaining an expense ceiling below <strong>₹{suggestedLimit.toLocaleString()}</strong>.
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default BudgetRecommendation;