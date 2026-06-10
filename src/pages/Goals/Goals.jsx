import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaPiggyBank, FaTrash, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const Goals = () => {
    const [goals, setGoals] = useState(() => {
        const stored = localStorage.getItem("savings_goals");
        return stored ? JSON.parse(stored) : [
            { id: 1, title: "Emergency Fund", target: 50000, current: 18000, category: "Savings" },
            { id: 2, title: "Europe Summer Trip", target: 150000, current: 65000, category: "Travel" },
            { id: 3, title: "New Macbook Pro 16", target: 200000, current: 150000, category: "Gadgets" }
        ];
    });

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        target: "",
        current: "",
        category: "Savings"
    });

    const [depositModalGoal, setDepositModalGoal] = useState(null);
    const [depositAmount, setDepositAmount] = useState("");

    useEffect(() => {
        localStorage.setItem("savings_goals", JSON.stringify(goals));
    }, [goals]);

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.target) {
            toast.error("Please fill in goal title and target amount");
            return;
        }

        const newGoal = {
            id: Date.now(),
            title: formData.title,
            target: Number(formData.target),
            current: Number(formData.current) || 0,
            category: formData.category
        };

        setGoals(prev => [...prev, newGoal]);
        toast.success("Savings Goal Created!");
        setShowForm(false);
        setFormData({ title: "", target: "", current: "", category: "Savings" });
    };

    const handleDeleteGoal = (id) => {
        setGoals(prev => prev.filter(g => g.id !== id));
        toast.success("Savings Goal Removed");
    };

    const handleDeposit = (e) => {
        e.preventDefault();
        if (!depositAmount || Number(depositAmount) <= 0) {
            toast.error("Please enter a valid deposit amount");
            return;
        }

        setGoals(prev => prev.map(g => {
            if (g.id === depositModalGoal.id) {
                const updatedCurrent = g.current + Number(depositAmount);
                if (updatedCurrent >= g.target) {
                    toast.success(`Congratulations! You reached your goal: ${g.title}! 🎉`);
                } else {
                    toast.success(`Deposited ₹${Number(depositAmount).toLocaleString()} to ${g.title}`);
                }
                return { ...g, current: Math.min(updatedCurrent, g.target) };
            }
            return g;
        }));

        setDepositModalGoal(null);
        setDepositAmount("");
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8 max-w-5xl"
        >
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Savings Goals
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Track, allocate, and fund your financial objectives.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="
                        flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white
                        bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700
                        shadow-lg shadow-brand-500/15 transition-all cursor-pointer
                    "
                >
                    <FaPlus size={12} />
                    <span>Create Goal</span>
                </button>
            </div>

            {/* Create Goal Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleAddGoal} className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />
                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Goal Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. New iPhone"
                                    value={formData.title}
                                    onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                                    className="glass-input p-3 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Target Amount (₹)</label>
                                <input
                                    type="number"
                                    placeholder="Target"
                                    value={formData.target}
                                    onChange={(e) => setFormData(p => ({ ...p, target: e.target.value }))}
                                    className="glass-input p-3 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Initial Savings (₹)</label>
                                <input
                                    type="number"
                                    placeholder="Starting"
                                    value={formData.current}
                                    onChange={(e) => setFormData(p => ({ ...p, current: e.target.value }))}
                                    className="glass-input p-3 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                                    className="glass-input p-3 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40 cursor-pointer"
                                >
                                    <option value="Savings">Savings</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Gadgets">Gadgets</option>
                                    <option value="Automobile">Automobile</option>
                                    <option value="Property">Property</option>
                                </select>
                            </div>

                            <div className="md:col-span-4 flex justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-indigo-600 shadow-md shadow-brand-500/10"
                                >
                                    Save Goal
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Goals list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal) => {
                    const percentage = Math.round((goal.current / goal.target) * 100);
                    const isCompleted = goal.current >= goal.target;
                    
                    return (
                        <div key={goal.id} className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden group">
                            {/* Accent Glow border */}
                            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${
                                isCompleted ? "from-emerald-400 to-teal-500 animate-pulse" : "from-brand-500 to-indigo-600"
                            }`} />

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[9px] font-bold text-brand-500 dark:text-brand-400 uppercase tracking-widest bg-brand-500/10 px-2 py-0.5 rounded-md">
                                        {goal.category}
                                    </span>
                                    <h3 className="font-extrabold text-base text-slate-800 dark:text-white mt-1.5 flex items-center gap-2">
                                        {goal.title}
                                        {isCompleted && <FaCheckCircle className="text-emerald-500 animate-bounce" size={14} />}
                                    </h3>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setDepositModalGoal(goal)}
                                        disabled={isCompleted}
                                        className="
                                            px-3 py-1.5 rounded-xl text-[10px] font-bold text-white bg-brand-500 hover:bg-brand-600 
                                            disabled:bg-slate-100 disabled:dark:bg-slate-800/40 disabled:text-slate-400 disabled:cursor-not-allowed transition-all cursor-pointer
                                        "
                                    >
                                        Deposit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGoal(goal.id)}
                                        className="
                                            p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-500 transition-all cursor-pointer
                                        "
                                    >
                                        <FaTrash size={10} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                                    <span>₹{goal.current.toLocaleString()} saved</span>
                                    <span>Target: ₹{goal.target.toLocaleString()}</span>
                                </div>

                                {/* Progress Bar wrapper */}
                                <div className="w-full h-3 bg-slate-200/50 dark:bg-slate-900/40 rounded-full overflow-hidden relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-full bg-gradient-to-r ${
                                            isCompleted ? "from-emerald-400 to-teal-500" : "from-brand-500 to-indigo-600"
                                        }`}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1">
                                    <span>Progress Quotient</span>
                                    <span className={isCompleted ? "text-emerald-500" : "text-brand-500"}>{percentage}%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Deposit Modal Popup */}
            <AnimatePresence>
                {depositModalGoal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 w-[90%] max-w-sm relative"
                        >
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />
                            <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-2">
                                Deposit Funds to: {depositModalGoal.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Allocate cash from savings towards this specific objective.
                            </p>

                            <form onSubmit={handleDeposit} className="space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-bold text-slate-400 mb-1">Deposit Amount (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        className="glass-input p-3.5 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setDepositModalGoal(null)}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-500 hover:bg-brand-600"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Goals;