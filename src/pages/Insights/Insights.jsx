import React from "react";
import { useFinance } from "../../context/FinanceContext";
import HealthScoreCard from "../../components/ui/HealthScoreCard"
import { calculateFinancialHealth } from "../../utils/financialHealth";
import ExpensePredictionCard
    from "../../components/Insights/ExpensePredictionCard";

const Insights = () => {
    const { transactions, goals = [] } = useFinance();

    const health = calculateFinancialHealth(
        transactions,
        goals
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold">
                    AI Insights
                </h1>

                <p className="text-slate-500 dark:text-slate-400">
                    Smart financial analysis powered by your spending data.
                </p>
            </div>

            <HealthScoreCard
                score={health.score}
                status={health.status}
            />

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-slate-500 mb-2">
                        Total Income
                    </h3>

                    <p className="text-3xl font-bold text-green-500">
                        ₹{health.income}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-slate-500 mb-2">
                        Total Expense
                    </h3>

                    <p className="text-3xl font-bold text-red-500">
                        ₹{health.expense}
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="text-slate-500 mb-2">
                        Savings
                    </h3>

                    <p className="text-3xl font-bold text-indigo-500">
                        ₹{health.savings}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <ExpensePredictionCard />

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold mb-4">
                        AI Recommendation
                    </h2>

                    {health.expenseRatio > 80 ? (
                        <p>
                            Your expenses are high compared to your income.
                            Consider reducing non-essential spending.
                        </p>
                    ) : (
                        <p>
                            Great job! Your spending is under control.
                            Continue maintaining your savings rate.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Insights;