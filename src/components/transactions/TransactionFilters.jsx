import React from "react";
import Dropdown from "../ui/Dropdown";

const TransactionFilters = ({
    search,
    setSearch,
    category,
    setCategory,
    type,
    setType,
    sort,
    setSort,
}) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">Search</label>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="glass-input p-3 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">Category</label>
                <Dropdown
                    value={category}
                    onChange={setCategory}
                    options={[
                        { value: "all", label: "All Categories" },
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
                    ]}
                />
            </div>

            <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">Type</label>
                <Dropdown
                    value={type}
                    onChange={setType}
                    options={[
                        { value: "all", label: "All Types" },
                        { value: "income", label: "Income" },
                        { value: "expense", label: "Expense" },
                    ]}
                />
            </div>

            <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">Sort By</label>
                <Dropdown
                    value={sort}
                    onChange={setSort}
                    options={[
                        { value: "latest", label: "Latest Logged" },
                        { value: "oldest", label: "Oldest Logged" },
                        { value: "high", label: "Highest Amount" },
                        { value: "low", label: "Lowest Amount" },
                    ]}
                />
            </div>
        </div>
    );
};

export default TransactionFilters;