import React from "react";
import { useFinance } from "../../context/FinanceContext";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-panel p-3.5 border border-slate-200/50 dark:border-white/10 shadow-xl backdrop-blur-xl text-xs">
                <p className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="font-extrabold text-sm text-slate-800 dark:text-white">
                    Expense: <span className="text-indigo-500">₹{payload[0].value.toLocaleString("en-IN")}</span>
                </p>
            </div>
        );
    }
    return null;
};

const ExpenseTrendChart = () => {
    const { transactions } = useFinance();

    const monthlyData = {};

    transactions.forEach((transaction) => {
        if (transaction.type !== "expense") return;

        const date = new Date(transaction.date);

        const month = date.toLocaleString("default", {
            month: "short",
        });

        if (!monthlyData[month]) {
            monthlyData[month] = 0;
        }

        monthlyData[month] += Number(transaction.amount);
    });

    const chartData = Object.keys(monthlyData).map(
        (month) => ({
            month,
            expense: monthlyData[month],
        })
    );

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="
                glass-panel
                relative
                overflow-hidden
                p-6
                border
                border-slate-200/40
                dark:border-white/5
                group
            "
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-600" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-indigo-500" />
                        <span>Composed Trend Analysis</span>
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                        Monthly Expense Trend
                    </h3>
                </div>
            </div>

            <div className="h-72 w-full relative z-10">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorExpenseBar" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#4f46e5" />
                                </linearGradient>
                            </defs>
                            
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(148, 163, 184, 0.08)"
                                vertical={false}
                            />
                            
                            <XAxis
                                dataKey="month"
                                stroke="#94a3b8"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                dx={-5}
                                tickFormatter={(val) => `₹${val}`}
                            />
                            
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.03)" }} />
                            
                            {/* Bar Chart showing actual amounts */}
                            <Bar
                                dataKey="expense"
                                fill="url(#colorExpenseBar)"
                                radius={[8, 8, 0, 0]}
                                maxBarSize={40}
                            />

                            {/* Line overlay representing trend slope */}
                            <Line
                                type="monotone"
                                dataKey="expense"
                                stroke="#f43f5e"
                                strokeWidth={3}
                                dot={{ fill: "#f43f5e", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            Add expense transactions to visualize your spending trend.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ExpenseTrendChart;