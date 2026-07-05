import React, { useState } from "react";
import Dropdown from "../ui/Dropdown";
import { CATEGORY_FILTER_OPTIONS } from "../../constants/categories";

const DATE_PRESETS = [
    { value: "all", label: "All Time" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "custom", label: "Custom Range" },
];

const TransactionFilters = ({
    search,
    setSearch,
    category,
    setCategory,
    type,
    setType,
    sort,
    setSort,
    datePreset,
    setDatePreset,
    customDateFrom,
    setCustomDateFrom,
    customDateTo,
    setCustomDateTo,
}) => {
    // If parent doesn't pass date props, manage them locally
    const [localDatePreset, setLocalDatePreset] = useState("all");
    const [localDateFrom, setLocalDateFrom] = useState("");
    const [localDateTo, setLocalDateTo] = useState("");

    const activeDatePreset = datePreset ?? localDatePreset;
    const setActiveDatePreset = setDatePreset ?? setLocalDatePreset;
    const activeDateFrom = customDateFrom ?? localDateFrom;
    const setActiveDateFrom = setCustomDateFrom ?? setLocalDateFrom;
    const activeDateTo = customDateTo ?? localDateTo;
    const setActiveDateTo = setCustomDateTo ?? setLocalDateTo;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">
                        Search
                    </label>
                    <input
                        type="text"
                        placeholder="Search by title, merchant, notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="glass-input p-3 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                        id="filter-search"
                    />
                </div>

                {/* Category */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">
                        Category
                    </label>
                    <Dropdown
                        value={category}
                        onChange={setCategory}
                        options={CATEGORY_FILTER_OPTIONS}
                    />
                </div>

                {/* Type */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">
                        Type
                    </label>
                    <Dropdown
                        value={type}
                        onChange={setType}
                        options={[
                            { value: "all", label: "All Types" },
                            { value: "income", label: "💚 Income" },
                            { value: "expense", label: "❤️ Expense" },
                        ]}
                    />
                </div>

                {/* Sort */}
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 ml-1">
                        Sort By
                    </label>
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

            {/* Date Preset Row */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                    Period:
                </span>
                {DATE_PRESETS.map((preset) => (
                    <button
                        key={preset.value}
                        onClick={() => setActiveDatePreset(preset.value)}
                        className={`
                            px-3 py-1.5 rounded-xl text-[10px] font-bold
                            transition-all duration-200 border cursor-pointer
                            ${activeDatePreset === preset.value
                                ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20"
                                : "bg-slate-50/50 dark:bg-slate-900/20 text-slate-500 border-slate-200/40 dark:border-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                            }
                        `}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            {/* Custom Date Range */}
            {activeDatePreset === "custom" && (
                <div className="flex items-center gap-3 pl-1">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            From
                        </label>
                        <input
                            type="date"
                            value={activeDateFrom}
                            onChange={(e) => setActiveDateFrom(e.target.value)}
                            className="glass-input p-2.5 rounded-xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                            id="filter-date-from"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                            To
                        </label>
                        <input
                            type="date"
                            value={activeDateTo}
                            onChange={(e) => setActiveDateTo(e.target.value)}
                            className="glass-input p-2.5 rounded-xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                            id="filter-date-to"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionFilters;