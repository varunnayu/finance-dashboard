import React, { useState, useMemo } from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import TransactionForm from "../../components/transactions/TransactionForm";
import TransactionList from "../../components/transactions/TransactionList";
import TransactionFilters from "../../components/transactions/TransactionFilters";

const Transactions = () => {
    const { transactions, balance, income, expense } = useFinance();

    const [editingTransaction, setEditingTransaction] = useState(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [type, setType] = useState("all");
    const [sort, setSort] = useState("latest");
    const [datePreset, setDatePreset] = useState("all");
    const [customDateFrom, setCustomDateFrom] = useState("");
    const [customDateTo, setCustomDateTo] = useState("");

    // Date filtering helper
    const getDateRange = () => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        switch (datePreset) {
            case "today":
                return { from: today, to: new Date(today.getTime() + 86400000) };
            case "yesterday": {
                const yesterday = new Date(today.getTime() - 86400000);
                return { from: yesterday, to: today };
            }
            case "7days":
                return { from: new Date(today.getTime() - 7 * 86400000), to: new Date(today.getTime() + 86400000) };
            case "30days":
                return { from: new Date(today.getTime() - 30 * 86400000), to: new Date(today.getTime() + 86400000) };
            case "custom":
                return {
                    from: customDateFrom ? new Date(customDateFrom) : null,
                    to: customDateTo ? new Date(new Date(customDateTo).getTime() + 86400000) : null,
                };
            default:
                return { from: null, to: null };
        }
    };

    const filteredTransactions = useMemo(() => {
        const dateRange = getDateRange();
        const searchLower = search.toLowerCase();

        return transactions
            .filter((item) => {
                // Search across title, merchant, notes, refNumber, paymentApp
                if (searchLower) {
                    const searchableText = [
                        item.title, item.merchant, item.notes,
                        item.refNumber, item.paymentApp, item.bankName,
                        item.category,
                    ].filter(Boolean).join(" ").toLowerCase();
                    if (!searchableText.includes(searchLower)) return false;
                }
                return true;
            })
            .filter((item) =>
                category === "all" ? true : item.category === category
            )
            .filter((item) =>
                type === "all" ? true : item.type === type
            )
            .filter((item) => {
                // Date range filtering
                if (!dateRange.from && !dateRange.to) return true;
                const itemDate = new Date(item.date);
                if (isNaN(itemDate.getTime())) return true;
                if (dateRange.from && itemDate < dateRange.from) return false;
                if (dateRange.to && itemDate >= dateRange.to) return false;
                return true;
            })
            .sort((a, b) => {
                if (sort === "high") return b.amount - a.amount;
                if (sort === "low") return a.amount - b.amount;
                if (sort === "oldest") return new Date(a.date || 0) - new Date(b.date || 0);
                return new Date(b.date || 0) - new Date(a.date || 0);
            });
    }, [transactions, search, category, type, sort, datePreset, customDateFrom, customDateTo]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Ledger Log
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Log new transactions and browse history items.
                    </p>
                </div>

                {/* Available balance header widget */}
                <div className="glass-panel px-6 py-3 border border-slate-200/40 dark:border-white/5 flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500 to-indigo-600" />
                    <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                            Net Balance
                        </span>
                        <h2 className={`text-xl font-black tracking-tight ${balance >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                            ₹{balance.toLocaleString("en-IN")}
                        </h2>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200/60 dark:bg-white/10" />
                    <div className="flex gap-4 text-xs font-bold">
                        <div>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Inflow</span>
                            <span className="text-emerald-500">₹{income.toLocaleString("en-IN")}</span>
                        </div>
                        <div>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Outflow</span>
                            <span className="text-rose-500">₹{expense.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-1">
                    <TransactionForm
                        editingTransaction={editingTransaction}
                        setEditingTransaction={setEditingTransaction}
                    />
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <TransactionFilters
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                        type={type}
                        setType={setType}
                        sort={sort}
                        setSort={setSort}
                        datePreset={datePreset}
                        setDatePreset={setDatePreset}
                        customDateFrom={customDateFrom}
                        setCustomDateFrom={setCustomDateFrom}
                        customDateTo={customDateTo}
                        setCustomDateTo={setCustomDateTo}
                    />

                    <TransactionList
                        transactions={filteredTransactions}
                        onEdit={setEditingTransaction}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default Transactions;