import React from "react";
import { motion } from "framer-motion";
import { useFinance } from "../../context/FinanceContext";
import BudgetForm from "../../components/Budget/BudgetForm";
import BudgetCard from "../../components/Budget/BudgetCard";
import BudgetStats from "../../components/Budget/BudgetStats";
import BudgetAlerts from "../../components/Budget/BudgetAlerts";
import BudgetRecommendation from "../../components/Budget/BudgetRecommendation";

const Budgets = () => {
    const { budgets } = useFinance();

    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                    Budget Allocations
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Designate spending limits by category and evaluate cash outflow constraints.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 items-start">
                {/* Configurations and Advisories column */}
                <div className="space-y-6 lg:col-span-1">
                    <BudgetForm />
                    <BudgetAlerts />
                    <BudgetRecommendation />
                </div>

                {/* Performance indicators and ledger cards column */}
                <div className="space-y-6 lg:col-span-2">
                    <BudgetStats />

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Category Allocation Targets
                            </h3>
                        </div>

                        {budgets.length > 0 ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {budgets.map((budget) => (
                                    <BudgetCard
                                        key={budget.id}
                                        budget={budget}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-panel p-12 text-center border border-slate-200/40 dark:border-white/5">
                                <p className="text-sm text-slate-400 dark:text-slate-500">
                                    No category limits established yet. Complete the form to define your first budget boundary.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Budgets;