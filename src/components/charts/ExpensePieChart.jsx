import React from "react";
import { useFinance } from "../../context/FinanceContext";
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from "recharts";

const COLORS = {
    Food: "#f59e0b",      // Amber
    Travel: "#0ea5e9",    // Sky
    Shopping: "#d946ef",  // Pink/Magenta
    Bills: "#f43f5e",     // Rose
    Health: "#14b8a6",    // Teal
    Education: "#6366f1",  // Indigo
    Salary: "#10b981",    // Emerald
    Given: "#f97316",     // Orange
    Spent: "#ef4444",     // Red
    Received: "#22c55e",  // Green
    Paylater: "#8b5cf6"   // Violet
};

const DEFAULT_COLOR = "#64748b";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="backdrop-blur-xl bg-white/75 dark:bg-slate-950/80 border border-slate-200/40 dark:border-white/10 px-3.5 py-2 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-800 dark:text-white">{payload[0].name}</p>
                <p className="text-sm font-black text-indigo-500 dark:text-indigo-400 mt-0.5">
                    ₹{Number(payload[0].value).toLocaleString("en-IN")}
                </p>
            </div>
        );
    }
    return null;
};

const ExpensePieChart = () => {
    const { transactions } = useFinance();

    const expenseData = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, curr) => {
            const existing = acc.find(
                (item) => item.name === curr.category
            );

            if (existing) {
                existing.value += Number(curr.amount);
            } else {
                acc.push({
                    name: curr.category,
                    value: Number(curr.amount),
                });
            }

            return acc;
        }, []);

    return (
        <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden">
            {/* Visual accent top border line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />

            <h2 className="text-base font-bold mb-4 tracking-tight text-slate-800 dark:text-white">
                Expenses By Category
            </h2>

            <div className="h-80 relative flex items-center justify-center">
                {expenseData.length === 0 ? (
                    <p className="text-sm text-slate-400 dark:text-slate-500">No expenses recorded yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={expenseData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={4}
                                labelLine={false}
                            >
                                {expenseData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[entry.name] || DEFAULT_COLOR} 
                                    />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default ExpensePieChart;