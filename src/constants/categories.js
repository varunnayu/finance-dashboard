/**
 * Unified Category Definitions
 * Single source of truth for all transaction categories across the app.
 * Each category includes value, label, emoji icon, Tailwind color classes.
 */

export const CATEGORIES = [
    { value: "Food", label: "Food", icon: "🍔", color: "amber", bgClass: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/10" },
    { value: "Groceries", label: "Groceries", icon: "🛒", color: "lime", bgClass: "bg-lime-500/10 text-lime-600 dark:bg-lime-500/20 dark:text-lime-400 border border-lime-500/10" },
    { value: "Transport", label: "Transport", icon: "🚗", color: "sky", bgClass: "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border border-sky-500/10" },
    { value: "Fuel", label: "Fuel", icon: "⛽", color: "orange", bgClass: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-500/10" },
    { value: "Utilities", label: "Utilities", icon: "💡", color: "yellow", bgClass: "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 border border-yellow-500/10" },
    { value: "Entertainment", label: "Entertainment", icon: "🎬", color: "pink", bgClass: "bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 border border-pink-500/10" },
    { value: "Healthcare", label: "Healthcare", icon: "🏥", color: "teal", bgClass: "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-500/10" },
    { value: "Shopping", label: "Shopping", icon: "🛍️", color: "purple", bgClass: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-purple-500/10" },
    { value: "EMI", label: "EMI / Loan", icon: "🏦", color: "red", bgClass: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/10" },
    { value: "Housing", label: "Housing", icon: "🏠", color: "stone", bgClass: "bg-stone-500/10 text-stone-600 dark:bg-stone-500/20 dark:text-stone-400 border border-stone-500/10" },
    { value: "Charity", label: "Charity", icon: "❤️", color: "rose", bgClass: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/10" },
    { value: "Investment", label: "Investment", icon: "📈", color: "emerald", bgClass: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/10" },
    { value: "Education", label: "Education", icon: "📚", color: "indigo", bgClass: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 border border-indigo-500/10" },
    { value: "Salary", label: "Salary", icon: "💰", color: "emerald", bgClass: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/10" },
    { value: "Travel", label: "Travel", icon: "✈️", color: "cyan", bgClass: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 border border-cyan-500/10" },
    { value: "Bills", label: "Bills", icon: "📄", color: "rose", bgClass: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/10" },
    { value: "Health", label: "Health", icon: "💊", color: "teal", bgClass: "bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400 border border-teal-500/10" },
    { value: "Given", label: "Given", icon: "🤝", color: "orange", bgClass: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border border-orange-500/10" },
    { value: "Spent", label: "Spent", icon: "💸", color: "red", bgClass: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/10" },
    { value: "Received", label: "Received", icon: "📥", color: "emerald", bgClass: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/10" },
    { value: "Paylater", label: "Paylater", icon: "⏳", color: "violet", bgClass: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 border border-violet-500/10" },
    { value: "Others", label: "Others", icon: "📌", color: "slate", bgClass: "bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border border-slate-500/10" },
];

/** Get the category values as a flat array of strings */
export const CATEGORY_VALUES = CATEGORIES.map(c => c.value);

/** Get dropdown options for <Dropdown> and <select> components */
export const CATEGORY_OPTIONS = CATEGORIES.map(c => ({
    value: c.value,
    label: `${c.icon} ${c.label}`,
}));

/** Get dropdown options with "All" prepended for filter dropdowns */
export const CATEGORY_FILTER_OPTIONS = [
    { value: "all", label: "All Categories" },
    ...CATEGORY_OPTIONS,
];

/**
 * Look up the styling class for a category.
 * Falls back to slate/neutral for unknown categories.
 */
export const getCategoryStyle = (categoryValue) => {
    const found = CATEGORIES.find(c => c.value === categoryValue);
    return found?.bgClass || "bg-slate-500/10 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border border-slate-500/10";
};

/**
 * Look up the emoji icon for a category.
 */
export const getCategoryIcon = (categoryValue) => {
    const found = CATEGORIES.find(c => c.value === categoryValue);
    return found?.icon || "📌";
};
