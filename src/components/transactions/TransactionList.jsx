import React, { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import toast from "react-hot-toast";
import DeleteModal from "../modals/DeleteModal";
import { FaTrash, FaPen, FaArrowUp, FaArrowDown } from "react-icons/fa";

const TransactionList = ({ transactions, onEdit }) => {
    const { deleteTransaction } = useFinance();
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const handleConfirmDelete = () => {
        deleteTransaction(deleteId);
        toast.success("Transaction Deleted Successfully");
        setShowModal(false);
        setDeleteId(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDeleteId(null);
    };

    const getCategoryStyles = (category) => {
        switch (category) {
            case "Food":
                return "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/10";
            case "Travel":
                return "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/10";
            case "Shopping":
                return "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/10";
            case "Bills":
                return "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/10";
            case "Health":
                return "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-500/10";
            case "Education":
                return "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/10";
            case "Salary":
                return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/10";
            default:
                return "bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border border-slate-500/10";
        }
    };

    return (
        <>
            <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden">
                {/* Visual accent top border line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />

                <h2 className="text-lg font-bold mb-4 tracking-tight text-slate-800 dark:text-white">
                    Ledger Log
                </h2>

                {transactions.length === 0 ? (
                    <div className="text-center py-10 rounded-2xl bg-white/20 dark:bg-white/5 border border-slate-200/10 dark:border-white/5">
                        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400">
                            No Transactions Logged
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            Add transactions above to see them in this ledger.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((item) => (
                            <div
                                key={item.id}
                                className="
                                    flex
                                    flex-col
                                    sm:flex-row
                                    sm:items-center
                                    justify-between
                                    gap-4
                                    bg-white/20
                                    dark:bg-white/2
                                    backdrop-blur-md
                                    border
                                    border-slate-200/35
                                    dark:border-white/5
                                    rounded-2xl
                                    p-4
                                    hover:shadow-md
                                    hover:bg-white/35
                                    dark:hover:bg-white/5
                                    hover:scale-[1.005]
                                    transition-all
                                    duration-300
                                "
                            >
                                <div className="flex items-center gap-3">
                                    {/* Small circle indicator with arrow depending on type */}
                                    <div className={`
                                        w-10
                                        h-10
                                        rounded-xl
                                        flex
                                        items-center
                                        justify-center
                                        text-xs
                                        ${item.type === "income"
                                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
                                            : "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                                        }
                                    `}>
                                        {item.type === "income" ? <FaArrowUp /> : <FaArrowDown />}
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-sm text-slate-800 dark:text-white">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${getCategoryStyles(item.category)}`}>
                                                {item.category}
                                            </span>
                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                                                {item.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 justify-between sm:justify-end">
                                    <span
                                        className={`font-black text-sm tracking-tight ${item.type === "income"
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-rose-600 dark:text-rose-400"
                                        }`}
                                    >
                                        {item.type === "income" ? "+" : "-"} ₹
                                        {Number(item.amount).toLocaleString("en-IN")}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="
                                                p-2
                                                bg-amber-500/10
                                                hover:bg-amber-500
                                                text-amber-600
                                                hover:text-white
                                                rounded-xl
                                                transition-all
                                                duration-300
                                            "
                                            title="Edit Transaction"
                                        >
                                            <FaPen size={12} />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteClick(item.id)}
                                            className="
                                                p-2
                                                bg-rose-500/10
                                                hover:bg-rose-500
                                                text-rose-600
                                                hover:text-white
                                                rounded-xl
                                                transition-all
                                                duration-300
                                            "
                                            title="Delete Transaction"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <DeleteModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default TransactionList;