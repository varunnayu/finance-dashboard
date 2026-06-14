import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import { predictMonthlyExpense } from "../../utils/expensePrediction";
import { Sparkles, CalendarClock, TrendingUp, TrendingDown, Coins } from "lucide-react";

const ExpensePredictionCard = () => {
    const { transactions } = useFinance();

    const prediction = predictMonthlyExpense(transactions);

    const isHigh = prediction.trend === "High Spending";

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
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 to-indigo-600" />
            
            {/* Ambient background glow */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-20 bg-purple-500 pointer-events-none" />

            <div className="flex gap-4 items-start relative z-10 mb-6">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/15">
                    <Sparkles className="w-5 h-5" />
                </div>
                
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                        Forecast Engine
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                        Expense Prediction
                    </h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="p-4 rounded-xl bg-white/20 dark:bg-white/2 border border-slate-200/20 dark:border-white/5 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Current Spent
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-slate-400" />
                        <h2 className="text-xl font-black text-slate-800 dark:text-white">
                            ₹{Number(prediction.currentExpense).toLocaleString("en-IN")}
                        </h2>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-white/20 dark:bg-white/2 border border-slate-200/20 dark:border-white/5 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Predicted Month End
                    </p>
                    <div className="flex items-center gap-1.5">
                        <CalendarClock className="w-4 h-4 text-indigo-500" />
                        <h2 className="text-xl font-black text-indigo-500">
                            ₹{Number(prediction.predictedExpense).toLocaleString("en-IN")}
                        </h2>
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-white/20 dark:bg-white/2 border border-slate-200/20 dark:border-white/5 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Cash Flow Trend
                    </p>
                    <div className="flex items-center gap-2">
                        {isHigh ? (
                            <TrendingUp className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
                        ) : (
                            <TrendingDown className="w-4.5 h-4.5 text-emerald-500" />
                        )}
                        <h2 className={`font-black text-sm capitalize ${isHigh ? "text-rose-500" : "text-emerald-500"}`}>
                            {prediction.trend}
                        </h2>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ExpensePredictionCard;