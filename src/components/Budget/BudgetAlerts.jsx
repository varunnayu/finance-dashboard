import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, Info } from "lucide-react";

const BudgetAlerts = () => {
    const { budgets, transactions } = useFinance();

    const alertItems = budgets.map((budget) => {
        const spent = transactions
            .filter(
                (t) =>
                    t.type === "expense" &&
                    t.category.toLowerCase().trim() === budget.category.toLowerCase().trim()
            )
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const ratio = budget.amount > 0 ? spent / budget.amount : 0;

        return {
            ...budget,
            spent,
            ratio,
        };
    }).filter(item => item.ratio >= 0.8);

    return (
        <div className="glass-panel p-6 relative overflow-hidden border border-slate-200/40 dark:border-white/5">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-rose-600" />
            
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Active Budget Alerts
            </h2>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {alertItems.length > 0 ? (
                        alertItems.map((item) => {
                            const isOver = item.ratio > 1;
                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className={`
                                        p-4
                                        rounded-xl
                                        flex
                                        items-start
                                        gap-3
                                        border
                                        ${isOver 
                                            ? "bg-rose-500/10 border-rose-500/20 text-rose-800 dark:text-rose-200" 
                                            : "bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-200"}
                                    `}
                                >
                                    <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isOver ? "text-rose-500" : "text-amber-500 animate-pulse"}`} />
                                    <div className="text-xs space-y-1">
                                        <p className="font-extrabold capitalize">
                                            {item.category} Budget {isOver ? "Exceeded" : "Critical"}
                                        </p>
                                        <p className="opacity-90 leading-relaxed">
                                            {isOver 
                                                ? `You have spent ₹${item.spent.toLocaleString()} which is ₹${(item.spent - item.amount).toLocaleString()} over your ₹${item.amount.toLocaleString()} limit.`
                                                : `You have consumed ${(item.ratio * 100).toFixed(0)}% of your ₹${item.amount.toLocaleString()} budget (₹${item.spent.toLocaleString()} spent).`
                                            }
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-200 flex items-center gap-3"
                        >
                            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <div className="text-xs">
                                <p className="font-extrabold">All systems healthy</p>
                                <p className="opacity-80">None of your established category budgets have exceeded the 80% consumption threshold.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BudgetAlerts;