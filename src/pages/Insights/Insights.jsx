import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import { 
    FaLightbulb, 
    FaExclamationTriangle, 
    FaPiggyBank, 
    FaChartLine, 
    FaMicrochip, 
    FaArrowRight 
} from "react-icons/fa";

const Insights = () => {
    const { income, expense, balance, transactions } = useFinance();

    const expenseRatio = income > 0 ? (expense / income) * 100 : 0;
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;

    // Generate dynamic suggestions based on real ledger numbers
    const getSystemInsights = () => {
        const insights = [];

        // Insight 1: Net flow summary
        if (balance < 0) {
            insights.push({
                type: "danger",
                icon: <FaExclamationTriangle className="text-rose-500 w-5 h-5" />,
                title: "Negative Asset Flow Detected",
                description: `Your expenditures exceed your income channels by ₹${Math.abs(balance).toLocaleString("en-IN")}. Adjust discretionary categories immediately.`,
                tip: "Identify repeating subscriptions and delay non-essential shopping items.",
                glow: "from-rose-500/10 to-orange-500/5",
                accent: "bg-rose-500"
            });
        } else if (savingsRate > 30) {
            insights.push({
                type: "success",
                icon: <FaPiggyBank className="text-emerald-500 w-5 h-5" />,
                title: "Outstanding Savings Efficiency",
                description: `You are saving a superb ${savingsRate.toFixed(0)}% of your monthly revenues. Excellent budgeting!`,
                tip: "Set up auto-investments into index funds or mutual funds to grow your funds.",
                glow: "from-emerald-500/10 to-teal-500/5",
                accent: "bg-emerald-500"
            });
        } else {
            insights.push({
                type: "warning",
                icon: <FaLightbulb className="text-amber-500 w-5 h-5" />,
                title: "Moderate Reserves Accumulation",
                description: `You have saved a net of ₹${balance.toLocaleString("en-IN")} (${savingsRate.toFixed(0)}% savings rate) this term. There is room to optimize.`,
                tip: "Target a 20% savings quota to accelerate your financial freedom objectives.",
                glow: "from-amber-500/10 to-yellow-500/5",
                accent: "bg-amber-500"
            });
        }

        // Insight 2: Transaction Density Analysis
        if (transactions.length > 8) {
            insights.push({
                type: "info",
                icon: <FaChartLine className="text-blue-500 w-5 h-5" />,
                title: "High Frequency Expenditure Stream",
                description: `You logged ${transactions.length} transactions this term. Frequent micro-transactions can create stealthy budget leaks.`,
                tip: "Consolidate micro-transfers to minimize administrative costs and transaction fees.",
                glow: "from-blue-500/10 to-indigo-500/5",
                accent: "bg-blue-500"
            });
        }

        // Insight 3: Expense category alerts
        const foodExpenses = transactions
            .filter(t => t.type === "expense" && t.category === "Food")
            .reduce((acc, curr) => acc + Number(curr.amount), 0);

        if (foodExpenses > 0 && expense > 0 && (foodExpenses / expense) > 0.4) {
            insights.push({
                type: "warning",
                icon: <FaLightbulb className="text-indigo-500 w-5 h-5" />,
                title: "Elevated Dining Expenditures",
                description: `Food expenditures represent ${(foodExpenses / expense * 100).toFixed(0)}% of your total outflows.`,
                tip: "Try tracking restaurant visits separately from groceries and set a weekly cap.",
                glow: "from-indigo-500/10 to-purple-500/5",
                accent: "bg-indigo-500"
            });
        }

        // Default static advisor tips if ledger is empty
        if (insights.length === 0) {
            insights.push({
                type: "info",
                icon: <FaLightbulb className="text-brand-500 w-5 h-5" />,
                title: "No Live Insights Formed",
                description: "Our AI analysis system requires a few transactions in the ledger to assemble profiles.",
                tip: "Add transaction data under the Ledger tab to unlock insights.",
                glow: "from-indigo-500/10 to-purple-500/5",
                accent: "bg-brand-500"
            });
        }

        return insights;
    };

    const systemInsights = getSystemInsights();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8 max-w-4xl"
        >
            {/* Header info */}
            <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-500/10 dark:bg-brand-500/20 text-brand-500 rounded-2xl shadow-md">
                    <FaMicrochip className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        AI Finance Insights
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Automated smart alerts and recommendations computed from your transactions.
                    </p>
                </div>
            </div>

            {/* Main Insights list */}
            <div className="space-y-6">
                {systemInsights.map((item, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -4, scale: 1.005 }}
                        className={`
                            glass-panel 
                            p-6 
                            border 
                            border-slate-200/40 
                            dark:border-white/5 
                            relative 
                            overflow-hidden 
                            bg-gradient-to-br 
                            ${item.glow} 
                            transition-all 
                            duration-300
                            group
                        `}
                    >
                        {/* Glowing vertical left edge accent stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-[4px] ${item.accent}`} />

                        <div className="flex gap-4 items-start relative z-10">
                            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 shadow-sm">
                                {item.icon}
                            </div>
                            
                            <div className="space-y-2 flex-1">
                                <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Actionable recommendation card block */}
                                <div className="mt-4 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-slate-200/20 dark:border-white/5 flex items-start gap-2">
                                    <FaArrowRight className="text-slate-400 dark:text-slate-500 w-3 h-3 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">AI Recommendation</span>
                                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                                            {item.tip}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Static Wisdom widget */}
            <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative bg-white/20 dark:bg-white/2">
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-2">
                    How it works
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    AI Finance Dashboard uses rule-based financial models to calculate savings quotas, spending frequencies, and budget margins. All calculations are performed entirely client-side, ensuring absolute data security.
                </p>
            </div>
        </motion.div>
    );
};

export default Insights;