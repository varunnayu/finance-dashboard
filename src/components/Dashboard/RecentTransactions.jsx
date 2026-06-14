import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const RecentTransactions = () => {
    const { transactions } = useFinance();

    const recentTransactions = [...transactions]
        .reverse()
        .slice(0, 5);

    const getCategoryStyles = (category) => {
        switch (category) {
            case "Food":
                return "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400";
            case "Travel":
                return "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400";
            case "Shopping":
                return "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
            case "Bills":
                return "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400";
            case "Health":
                return "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400";
            case "Education":
                return "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400";
            case "Salary":
                return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";
            case "Given":
                return "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400";
            case "Spent":
                return "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400";
            case "Received":
                return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";
            case "Paylater":
                return "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
            default:
                return "bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400";
        }
    };

    return (
        <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden">
            {/* Visual accent top border line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />

            <h2 className="text-lg font-bold mb-4 tracking-tight text-slate-800 dark:text-white">
                Recent Transactions
            </h2>

            {recentTransactions.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        No transactions logged yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {recentTransactions.map((item) => (
                        <div
                            key={item.id}
                            className="
                                flex 
                                justify-between 
                                items-center 
                                p-3 
                                rounded-2xl 
                                bg-white/20 
                                dark:bg-white/2 
                                hover:bg-white/35 
                                dark:hover:bg-white/5 
                                border 
                                border-slate-200/20 
                                dark:border-white/5 
                                transition-all
                                duration-300
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div className={`
                                    w-9 
                                    h-9 
                                    rounded-xl 
                                    flex 
                                    items-center 
                                    justify-center 
                                    text-[10px]
                                    ${item.type === "income"
                                        ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                                        : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                                    }
                                `}>
                                    {item.type === "income" ? <FaArrowUp /> : <FaArrowDown />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs text-slate-800 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${getCategoryStyles(item.category)}`}>
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            <span
                                className={`font-black text-xs tracking-tight ${item.type === "income"
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-rose-600 dark:text-rose-400"
                                    }`}
                            >
                                {item.type === "income" ? "+" : "-"} ₹
                                {Number(item.amount).toLocaleString("en-IN")}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentTransactions;