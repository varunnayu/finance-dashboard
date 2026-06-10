import React from "react";
import { useFinance } from "../../context/FinanceContext";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="backdrop-blur-xl bg-white/75 dark:bg-slate-950/80 border border-slate-200/40 dark:border-white/10 px-3.5 py-2.5 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-800 dark:text-white capitalize">Overview</p>
                <div className="mt-1 space-y-0.5">
                    {payload.map((entry, idx) => (
                        <p key={idx} className="text-xs font-semibold" style={{ color: entry.fill }}>
                            {entry.name}: ₹{Number(entry.value).toLocaleString("en-IN")}
                        </p>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const FinanceBarChart = () => {
    const { income, expense } = useFinance();

    const data = [
        {
            name: "Current Balance Summary",
            Income: income,
            Expense: expense,
        },
    ];

    return (
        <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden">
            {/* Visual accent top border line */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />

            <h2 className="text-base font-bold mb-4 tracking-tight text-slate-800 dark:text-white">
                Income vs Expense
            </h2>

            <div className="h-80 relative flex items-center justify-center">
                {income === 0 && expense === 0 ? (
                    <p className="text-sm text-slate-400 dark:text-slate-500">No finance data logged yet.</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barGap={12}>
                            <XAxis 
                                dataKey="name" 
                                stroke="#94a3b8" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(val) => `₹${val}`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Legend 
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }}
                            />
                            <Bar
                                dataKey="Income"
                                fill="#10b981"
                                radius={[12, 12, 0, 0]}
                                maxBarSize={60}
                            />
                            <Bar
                                dataKey="Expense"
                                fill="#f43f5e"
                                radius={[12, 12, 0, 0]}
                                maxBarSize={60}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default FinanceBarChart;