import React, { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

const PREDEFINED_CATEGORIES = [
    "Food",
    "Grocery",
    "Dining",
    "Bills",
    "Utilities",
    "Transport",
    "Travel",
    "Entertainment",
    "Housing",
    "Health",
    "Given",
    "Spent",
    "Received",
    "Paylater",
    "Other"
];

const BudgetForm = () => {
    const { addBudget } = useFinance();
    const [category, setCategory] = useState("");
    const [customCategory, setCustomCategory] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!category) {
            toast.error("Please select or enter a category");
            return;
        }

        const finalCategory = category === "custom" ? customCategory.trim() : category.trim();

        if (!finalCategory) {
            toast.error("Please enter a custom category name");
            return;
        }

        if (!amount || Number(amount) <= 0) {
            toast.error("Please enter a valid budget amount");
            return;
        }

        addBudget({
            category: finalCategory,
            amount: Number(amount),
        });

        setCategory("");
        setCustomCategory("");
        setAmount("");
        toast.success(`Set budget of ₹${Number(amount).toLocaleString()} for ${finalCategory}`);
    };

    return (
        <div className="glass-panel p-6 relative overflow-hidden border border-slate-200/40 dark:border-white/5">
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />
            
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-brand-500" />
                Create Category Budget
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="glass-input w-full p-3 rounded-xl text-slate-700 dark:text-slate-200 bg-white/20 dark:bg-black/20 text-sm cursor-pointer"
                    >
                        <option value="" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">Select Category</option>
                        {PREDEFINED_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
                                {cat}
                            </option>
                        ))}
                        <option value="custom" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">Custom Category...</option>
                    </select>
                </div>

                {category === "custom" && (
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                            Custom Category Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter custom category"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="glass-input w-full p-3 rounded-xl text-sm"
                            required
                        />
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                        Budget Limit (INR)
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 15000"
                        className="glass-input w-full p-3 rounded-xl text-sm"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    className="
                        w-full
                        py-3.5
                        rounded-xl
                        bg-gradient-to-r
                        from-brand-500
                        to-indigo-600
                        hover:from-brand-600
                        hover:to-indigo-700
                        text-white
                        font-extrabold
                        text-sm
                        shadow-md
                        shadow-brand-500/10
                        transition-all
                        duration-300
                        cursor-pointer
                        mt-2
                    "
                >
                    Establish Budget Limit
                </motion.button>
            </form>
        </div>
    );
};

export default BudgetForm;