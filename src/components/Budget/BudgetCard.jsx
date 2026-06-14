import React from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import { Trash2, AlertOctagon, CheckCircle2, AlertTriangle, ShoppingBag, Utensils, Car, Lightbulb, Grid } from "lucide-react";
import toast from "react-hot-toast";

const categoryMeta = {
    food: { icon: <Utensils className="w-4 h-4" />, text: "text-emerald-500", bg: "bg-emerald-500/10" },
    grocery: { icon: <ShoppingBag className="w-4 h-4" />, text: "text-emerald-500", bg: "bg-emerald-500/10" },
    dining: { icon: <Utensils className="w-4 h-4" />, text: "text-emerald-500", bg: "bg-emerald-500/10" },
    bills: { icon: <Lightbulb className="w-4 h-4" />, text: "text-orange-500", bg: "bg-orange-500/10" },
    utilities: { icon: <Lightbulb className="w-4 h-4" />, text: "text-orange-500", bg: "bg-orange-500/10" },
    transport: { icon: <Car className="w-4 h-4" />, text: "text-blue-500", bg: "bg-blue-500/10" },
    travel: { icon: <Car className="w-4 h-4" />, text: "text-blue-500", bg: "bg-blue-500/10" },
    other: { icon: <Grid className="w-4 h-4" />, text: "text-slate-500", bg: "bg-slate-500/10" },
};

const getMeta = (categoryName) => {
    const key = categoryName.toLowerCase().trim();
    return categoryMeta[key] || {
        icon: <Grid className="w-4 h-4" />,
        text: "text-purple-500",
        bg: "bg-purple-500/10",
    };
};

const BudgetCard = ({ budget }) => {
    const { transactions, deleteBudget } = useFinance();

    const spent = transactions
        .filter(
            (t) =>
                t.type === "expense" &&
                t.category.toLowerCase().trim() === budget.category.toLowerCase().trim()
        )
        .reduce(
            (sum, t) =>
                sum + Number(t.amount),
            0
        );

    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    const remaining = budget.amount - spent;
    const meta = getMeta(budget.category);

    let barColor = "from-emerald-400 to-teal-500";
    let accentBorder = "from-emerald-500 to-teal-600";
    let statusText = "On Track";
    let statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    let statusBadge = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15";

    if (progress > 100) {
        barColor = "from-red-500 to-rose-600";
        accentBorder = "from-red-500 to-rose-600";
        statusText = "Exceeded Limit";
        statusIcon = <AlertOctagon className="w-4 h-4 text-rose-500" />;
        statusBadge = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/15";
    } else if (progress > 80) {
        barColor = "from-amber-400 to-orange-500";
        accentBorder = "from-amber-500 to-orange-600";
        statusText = "Warning Phase";
        statusIcon = <AlertTriangle className="w-4 h-4 text-amber-500" />;
        statusBadge = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15";
    }

    const handleDelete = () => {
        deleteBudget(budget.id);
        toast.success(`Removed budget for ${budget.category}`);
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
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
                flex
                flex-col
                justify-between
            "
        >
            {/* dynamic top stripe */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${accentBorder}`} />
            
            <div>
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-2.5 rounded-xl ${meta.bg} ${meta.text}`}>
                            {meta.icon}
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-black text-slate-800 dark:text-white truncate capitalize">
                                {budget.category}
                            </h2>
                            <div className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-[9px] font-bold ${statusBadge}`}>
                                {statusIcon}
                                <span>{statusText}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleDelete}
                        className="
                            p-2
                            rounded-xl
                            text-slate-400
                            hover:text-red-500
                            hover:bg-red-500/10
                            transition-colors
                            cursor-pointer
                        "
                        title="Delete Budget Limit"
                    >
                        <Trash2 className="w-4.5 h-4.5" />
                    </button>
                </div>

                {/* Progress metrics */}
                <div className="space-y-3 mt-5">
                    <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-black text-slate-800 dark:text-white">
                            ₹{spent.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                            of ₹{budget.amount.toLocaleString("en-IN")}
                        </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800/60 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className={`h-full rounded-full bg-gradient-to-r ${barColor}`}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom remaining ledger row */}
            <div className="mt-5 pt-3.5 border-t border-slate-100/50 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-400 dark:text-slate-500">Allowance Balance</span>
                {remaining >= 0 ? (
                    <span className="font-extrabold text-emerald-500 dark:text-emerald-400">
                        ₹{remaining.toLocaleString("en-IN")} Remaining
                    </span>
                ) : (
                    <span className="font-extrabold text-red-500 dark:text-red-400">
                        ₹{Math.abs(remaining).toLocaleString("en-IN")} Deficit
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default BudgetCard;