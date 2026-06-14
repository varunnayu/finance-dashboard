import React, { useState, useEffect } from "react";
import { useFinance } from "../../context/FinanceContext";
import toast from "react-hot-toast";
import Dropdown from "../ui/Dropdown";

const PREDEFINED_LIST = ["Food", "Travel", "Shopping", "Bills", "Health", "Education", "Salary", "Given", "Spent", "Received", "Paylater"];

const TransactionForm = ({ editingTransaction, setEditingTransaction }) => {
    const { addTransaction, updateTransaction } = useFinance();

    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        category: "Food",
        type: "expense",
        date: new Date().toISOString().split('T')[0],
    });

    const [customCategory, setCustomCategory] = useState("");

    // Effect to populate form when editing is active
    useEffect(() => {
        if (editingTransaction) {
            const isPredefined = PREDEFINED_LIST.includes(editingTransaction.category);
            setFormData({
                title: editingTransaction.title,
                amount: editingTransaction.amount.toString(),
                category: isPredefined ? editingTransaction.category : "custom",
                type: editingTransaction.type,
                date: editingTransaction.date || new Date().toISOString().split('T')[0],
            });
            if (!isPredefined) {
                setCustomCategory(editingTransaction.category);
            } else {
                setCustomCategory("");
            }
        }
    }, [editingTransaction]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.amount) {
            toast.error("Please fill in title and amount");
            return;
        }

        if (formData.category === "custom" && !customCategory.trim()) {
            toast.error("Please enter a custom category name");
            return;
        }

        const transactionData = {
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category === "custom" ? customCategory.trim() : formData.category,
            type: formData.type,
            date: formData.date || new Date().toISOString().split('T')[0],
        };

        if (editingTransaction) {
            updateTransaction({
                id: editingTransaction.id,
                ...transactionData
            });
            toast.success("Transaction Updated Successfully");
            setEditingTransaction(null);
        } else {
            addTransaction(transactionData);
            toast.success("Transaction Added Successfully");
        }

        // Reset form
        setFormData({
            title: "",
            amount: "",
            category: "Food",
            type: "expense",
            date: new Date().toISOString().split('T')[0],
        });
        setCustomCategory("");
    };

    const handleCancelEdit = () => {
        setEditingTransaction(null);
        setFormData({
            title: "",
            amount: "",
            category: "Food",
            type: "expense",
            date: new Date().toISOString().split('T')[0],
        });
        setCustomCategory("");
    };

    const isEditing = !!editingTransaction;

    return (
        <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden">
            {/* Ambient accent strip for edit vs add mode */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${
                isEditing ? "from-amber-400 to-orange-500" : "from-brand-500 to-indigo-600"
            }`} />

            <h2 className="text-lg font-bold mb-4 tracking-tight text-slate-800 dark:text-white">
                {isEditing ? "Edit Transaction" : "Add Transaction"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-400 mb-1 ml-1">Title</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="Transaction Title"
                        value={formData.title}
                        onChange={handleChange}
                        className="glass-input p-3.5 rounded-2xl text-sm text-slate-800 dark:text-white dark:bg-slate-900/40"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-400 mb-1 ml-1">Amount (₹)</label>
                    <input
                        type="number"
                        name="amount"
                        placeholder="Amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="glass-input p-3.5 rounded-2xl text-sm text-slate-800 dark:text-white dark:bg-slate-900/40"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-400 mb-1 ml-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="glass-input p-3.5 rounded-2xl text-sm text-slate-800 dark:text-white dark:bg-slate-900/40"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-slate-400 mb-1 ml-1">Category</label>
                    <Dropdown
                        value={formData.category}
                        onChange={(val) => setFormData(p => ({ ...p, category: val }))}
                        options={[
                            { value: "Food", label: "Food" },
                            { value: "Travel", label: "Travel" },
                            { value: "Shopping", label: "Shopping" },
                            { value: "Bills", label: "Bills" },
                            { value: "Health", label: "Health" },
                            { value: "Education", label: "Education" },
                            { value: "Salary", label: "Salary" },
                            { value: "Given", label: "Given" },
                            { value: "Spent", label: "Spent" },
                            { value: "Received", label: "Received" },
                            { value: "Paylater", label: "Paylater" },
                            { value: "custom", label: "Custom Category..." },
                        ]}
                    />
                </div>

                {formData.category === "custom" && (
                    <div className="flex flex-col md:col-span-2">
                        <label className="text-xs font-semibold text-slate-400 mb-1 ml-1">Custom Category Name</label>
                        <input
                            type="text"
                            placeholder="Enter custom category"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="glass-input p-3.5 rounded-2xl text-sm text-slate-800 dark:text-white dark:bg-slate-900/40"
                            required
                        />
                    </div>
                )}

                <div className="flex flex-col md:col-span-2">
                    <label className="text-xs font-semibold text-slate-400 mb-1 ml-1">Transaction Type</label>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, type: "income" }))}
                            className={`py-3 rounded-2xl font-bold text-sm transition-all duration-300 border ${
                                formData.type === "income"
                                    ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : "bg-slate-50 dark:bg-slate-900/20 text-slate-500 border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100/30"
                            }`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, type: "expense" }))}
                            className={`py-3 rounded-2xl font-bold text-sm transition-all duration-300 border ${
                                formData.type === "expense"
                                    ? "bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                    : "bg-slate-50 dark:bg-slate-900/20 text-slate-500 border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100/30"
                            }`}
                        >
                            Expense
                        </button>
                    </div>
                </div>

                <div className="flex gap-3 md:col-span-2 mt-2">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="
                                flex-1
                                py-3.5
                                rounded-2xl
                                font-bold
                                text-sm
                                bg-slate-100/60
                                dark:bg-slate-800/30
                                hover:bg-slate-200/60
                                dark:hover:bg-slate-800/60
                                text-slate-700
                                dark:text-slate-300
                                border
                                border-slate-200/50
                                dark:border-white/5
                                transition-all
                            "
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="
                            flex-1
                            py-3.5
                            rounded-2xl
                            font-bold
                            text-sm
                            text-white
                            bg-gradient-to-r
                            from-brand-500
                            to-indigo-600
                            hover:from-brand-600
                            hover:to-indigo-700
                            shadow-md
                            shadow-brand-500/10
                            hover:scale-[1.01]
                            transition-all
                        "
                    >
                        {isEditing ? "Save Changes" : "Add Transaction"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;