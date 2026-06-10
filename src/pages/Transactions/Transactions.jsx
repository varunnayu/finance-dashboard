import React, { useState } from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import TransactionForm from "../../components/transactions/TransactionForm";
import TransactionList from "../../components/transactions/TransactionList";
import TransactionFilters from "../../components/transactions/TransactionFilters";

const Transactions = () => {
    const { transactions } = useFinance();

    const [editingTransaction, setEditingTransaction] = useState(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [type, setType] = useState("all");
    const [sort, setSort] = useState("latest");

    const filteredTransactions = transactions
        .filter((item) =>
            item.title
                .toLowerCase()
                .includes(search.toLowerCase())
        )
        .filter((item) =>
            category === "all"
                ? true
                : item.category === category
        )
        .filter((item) =>
            type === "all"
                ? true
                : item.type === type
        )
        .sort((a, b) => {
            if (sort === "high")
                return b.amount - a.amount;

            if (sort === "low")
                return a.amount - b.amount;

            if (sort === "oldest")
                return (
                    new Date(a.date || 0) -
                    new Date(b.date || 0)
                );

            return (
                new Date(b.date || 0) -
                new Date(a.date || 0)
            );
        });

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Ledger Log
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Log new transactions and browse history items.
                </p>
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