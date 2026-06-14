import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import { PieChart, ShoppingBag, Utensils, Car, Lightbulb, Grid } from "lucide-react";

// Categorized icons and colors maps
const categoryMeta = {
    food: { icon: <Utensils className="w-3.5 h-3.5" />, color: "bg-emerald-500", progress: "from-emerald-400 to-teal-500", text: "text-emerald-500" },
    grocery: { icon: <ShoppingBag className="w-3.5 h-3.5" />, color: "bg-emerald-500", progress: "from-emerald-400 to-teal-500", text: "text-emerald-500" },
    dining: { icon: <Utensils className="w-3.5 h-3.5" />, color: "bg-emerald-500", progress: "from-emerald-400 to-teal-500", text: "text-emerald-500" },
    bills: { icon: <Lightbulb className="w-3.5 h-3.5" />, color: "bg-orange-500", progress: "from-orange-400 to-amber-500", text: "text-orange-500" },
    utilities: { icon: <Lightbulb className="w-3.5 h-3.5" />, color: "bg-orange-500", progress: "from-orange-400 to-amber-500", text: "text-orange-500" },
    transport: { icon: <Car className="w-3.5 h-3.5" />, color: "bg-blue-500", progress: "from-blue-400 to-indigo-500", text: "text-blue-500" },
    travel: { icon: <Car className="w-3.5 h-3.5" />, color: "bg-blue-500", progress: "from-blue-400 to-indigo-500", text: "text-blue-500" },
    other: { icon: <Grid className="w-3.5 h-3.5" />, color: "bg-slate-500", progress: "from-slate-400 to-slate-500", text: "text-slate-500" },
};

const getMeta = (categoryName) => {
    const key = categoryName.toLowerCase().trim();
    return categoryMeta[key] || {
        icon: <Grid className="w-3.5 h-3.5" />,
        color: "bg-purple-500",
        progress: "from-purple-400 to-indigo-500",
        text: "text-purple-500",
    };
};

const TopCategories = () => {
    const { transactions } = useFinance();

    const categoryMap = {};
    let totalExpense = 0;

    transactions
        .filter((t) => t.type === "expense")
        .forEach((t) => {
            const amt = Number(t.amount);
            categoryMap[t.category] = (categoryMap[t.category] || 0) + amt;
            totalExpense += amt;
        });

    const categories = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

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
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 to-pink-500" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <PieChart className="w-3 h-3 text-purple-500" />
                        <span>Expense Distribution</span>
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                        Top Categories
                    </h3>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {categories.length > 0 ? (
                    categories.map(([name, amount], index) => {
                        const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
                        const meta = getMeta(name);
                        return (
                            <div key={name} className="space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 ${meta.text}`}>
                                            {meta.icon}
                                        </div>
                                        <span className="font-bold text-slate-700 dark:text-slate-200 capitalize">
                                            {name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-semibold">
                                            {percent}%
                                        </span>
                                    </div>
                                    <span className="font-extrabold text-slate-800 dark:text-white">
                                        ₹{amount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                                        className={`h-full rounded-full bg-gradient-to-r ${meta.progress}`}
                                    />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="py-8 text-center">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            No expense data logged for this period.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default TopCategories;