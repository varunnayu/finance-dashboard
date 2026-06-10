import React from "react";
import {
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaPiggyBank,
} from "react-icons/fa";

import StatCard from "../ui/StatCard";
import RecentTransactions from "./RecentTransactions";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";

const Dashboard = () => {
    const {
        income,
        expense,
        balance,
        transactions,
    } = useFinance();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
        >
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Dashboard
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Your real-time financial tracking summary.
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    title="Net Worth"
                    amount={balance}
                    icon={<FaWallet className="w-5 h-5" />}
                    bgColor="bg-gradient-to-r from-blue-500 to-indigo-600"
                />

                <StatCard
                    title="Total Income"
                    amount={income}
                    icon={<FaArrowUp className="w-5 h-5" />}
                    bgColor="bg-gradient-to-r from-emerald-500 to-teal-600"
                />

                <StatCard
                    title="Total Expenses"
                    amount={expense}
                    icon={<FaArrowDown className="w-5 h-5" />}
                    bgColor="bg-gradient-to-r from-rose-500 to-orange-600"
                />

                <StatCard
                    title="Goal Progress"
                    amount={balance}
                    icon={<FaPiggyBank className="w-5 h-5" />}
                    bgColor="bg-gradient-to-r from-purple-500 to-pink-600"
                />
            </div>

            {/* Recent Transactions Section */}
            <div>
                <RecentTransactions />
            </div>

            {/* Financial Summary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Transactions KPI */}
                <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden group hover:scale-[1.01]">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-brand-500" />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Total Ledger Items
                    </span>
                    <p className="text-3xl font-black mt-2 tracking-tight text-slate-800 dark:text-white">
                        {transactions.length}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Active records tracking
                    </p>
                </div>

                {/* Expense Ratio KPI */}
                <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden group hover:scale-[1.01]">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose-500 to-orange-500" />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Expense-to-Income Ratio
                    </span>
                    <p className="text-3xl font-black mt-2 tracking-tight text-slate-800 dark:text-white">
                        {income > 0 ? ((expense / income) * 100).toFixed(1) : "0.0"}%
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Percentage of monthly intake spent
                    </p>
                </div>

                {/* Savings Rate KPI */}
                <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden group hover:scale-[1.01]">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500" />
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        Savings Quotient
                    </span>
                    <p className="text-3xl font-black mt-2 tracking-tight text-slate-800 dark:text-white">
                        {income > 0 ? ((balance / income) * 100).toFixed(1) : "0.0"}%
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Ratio of revenue retained
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;