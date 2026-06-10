import { useState, useMemo } from "react";
import { useFinance } from "../../context/FinanceContext";
import { motion } from "framer-motion";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        let formattedLabel = label;
        try {
            const dateObj = new Date(label);
            formattedLabel = dateObj.toLocaleDateString("en-IN", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            // fallback
        }

        return (
            <div className="backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border border-slate-200/40 dark:border-white/10 px-4 py-3 rounded-2xl shadow-xl">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{formattedLabel}</p>
                <div className="space-y-1">
                    {payload.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-6 justify-between">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                <span 
                                    className="w-2 h-2 rounded-full inline-block" 
                                    style={{ backgroundColor: entry.stroke || entry.fill }}
                                />
                                {entry.name}
                            </span>
                            <span className="text-xs font-black" style={{ color: entry.stroke || entry.fill }}>
                                ₹{Number(entry.value).toLocaleString("en-IN")}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

const FinanceLineChart = () => {
    const { transactions } = useFinance();
    const [timeframe, setTimeframe] = useState("30days");
    const [viewMode, setViewMode] = useState("split");

    const chartData = useMemo(() => {
        if (!transactions || transactions.length === 0) return [];

        const allSorted = [...transactions].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let runningBalance = 0;
        const dailyDataMap = {};

        allSorted.forEach((t) => {
            if (!t.date) return;
            const dateStr = t.date;

            if (!dailyDataMap[dateStr]) {
                dailyDataMap[dateStr] = {
                    date: dateStr,
                    Income: 0,
                    Expense: 0,
                    Balance: 0,
                };
            }

            const amt = Number(t.amount) || 0;
            if (t.type === "income") {
                dailyDataMap[dateStr].Income += amt;
                runningBalance += amt;
            } else if (t.type === "expense") {
                dailyDataMap[dateStr].Expense += amt;
                runningBalance -= amt;
            }

            dailyDataMap[dateStr].Balance = runningBalance;
        });

        const sortedDays = Object.values(dailyDataMap).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        return sortedDays.filter((day) => {
            const dayDate = new Date(day.date);
            const timeDiff = startOfToday.getTime() - dayDate.getTime();
            const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            if (timeframe === "7days") {
                return diffDays <= 7;
            }
            if (timeframe === "30days") {
                return diffDays <= 30;
            }
            if (timeframe === "month") {
                return (
                    dayDate.getFullYear() === currentYear &&
                    dayDate.getMonth() === currentMonth
                );
            }
            return true;
        });
    }, [transactions, timeframe]);

    const formatXAxis = (dateStr) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const hasData = chartData.length > 0;

    return (
        <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden xl:col-span-2">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">
                        Financial Trends
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Visualize income, expenses, and balance over time
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 items-center">
                    {/* View mode toggle with sliding animation */}
                    <div className="flex bg-slate-100/60 dark:bg-slate-900/40 p-1 rounded-xl border border-slate-200/40 dark:border-white/5 mr-2 relative">
                        {[
                            { id: "split", label: "Split" },
                            { id: "balance", label: "Net Balance" }
                        ].map((mode) => (
                            <button
                                key={mode.id}
                                onClick={() => setViewMode(mode.id)}
                                className="relative px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors duration-300 cursor-pointer z-10"
                            >
                                {viewMode === mode.id && (
                                    <motion.div
                                        layoutId="activeViewMode"
                                        className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm -z-10"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span className={viewMode === mode.id ? "text-brand-600 dark:text-brand-400" : "text-slate-500 dark:text-slate-400"}>
                                    {mode.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Timeframe selector with sliding animation */}
                    <div className="flex bg-slate-100/60 dark:bg-slate-900/40 p-1 rounded-xl border border-slate-200/40 dark:border-white/5 relative">
                        {[
                            { id: "7days", label: "7D" },
                            { id: "30days", label: "30D" },
                            { id: "month", label: "Month" },
                            { id: "all", label: "All" },
                        ].map((tf) => (
                            <button
                                key={tf.id}
                                onClick={() => setTimeframe(tf.id)}
                                className="relative px-3 py-1.5 rounded-lg text-xs font-bold transition-colors duration-300 cursor-pointer z-10"
                            >
                                {timeframe === tf.id && (
                                    <motion.div
                                        layoutId="activeTimeframe"
                                        className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm -z-10"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span className={timeframe === tf.id ? "text-brand-600 dark:text-brand-400" : "text-slate-500 dark:text-slate-400"}>
                                    {tf.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-80 relative flex items-center justify-center">
                {!hasData ? (
                    <div className="text-center p-6">
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            No transaction history matches the selected filters.
                        </p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid 
                                stroke="rgba(148, 163, 184, 0.15)" 
                                strokeDasharray="0"
                                vertical={true} 
                                horizontal={true}
                            />

                            <XAxis
                                dataKey="date"
                                tickFormatter={formatXAxis}
                                stroke="#94a3b8"
                                fontSize={10}
                                tickLine={true}
                                axisLine={true}
                                dy={8}
                            />

                            <YAxis
                                stroke="#94a3b8"
                                fontSize={10}
                                tickLine={true}
                                axisLine={true}
                                tickFormatter={(val) => `₹${val}`}
                                dx={-8}
                            />

                            <Tooltip 
                                content={<CustomTooltip />}
                                cursor={{ stroke: "rgba(148, 163, 184, 0.15)", strokeWidth: 1 }}
                            />

                            <Legend 
                                iconType="circle"
                                iconSize={8}
                                layout="horizontal"
                                align="right"
                                verticalAlign="top"
                                wrapperStyle={{ 
                                    border: '1px solid var(--legend-border, rgba(148, 163, 184, 0.25))', 
                                    borderRadius: '12px', 
                                    backgroundColor: 'var(--legend-bg, rgba(255, 255, 255, 0.85))', 
                                    color: 'var(--legend-text, #0f172a)',
                                    padding: '6px 12px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                                    top: -10,
                                    right: 10
                                }}
                            />

                            {viewMode === "split" ? (
                                <>
                                    <Line
                                        type="monotone"
                                        name="Income"
                                        dataKey="Income"
                                        stroke="#ff6b00"
                                        strokeWidth={3}
                                        dot={{ stroke: '#ff6b00', strokeWidth: 2, r: 5, fill: '#fbbf24', fillOpacity: 1 }}
                                        activeDot={{ stroke: '#ff6b00', strokeWidth: 2, r: 7, fill: '#fbbf24', fillOpacity: 1 }}
                                    />
                                    <Line
                                        type="monotone"
                                        name="Expense"
                                        dataKey="Expense"
                                        stroke="#db2777"
                                        strokeWidth={3}
                                        dot={{ stroke: '#db2777', strokeWidth: 2, r: 5, fill: '#f472b6', fillOpacity: 1 }}
                                        activeDot={{ stroke: '#db2777', strokeWidth: 2, r: 7, fill: '#f472b6', fillOpacity: 1 }}
                                    />
                                </>
                            ) : (
                                <Line
                                    type="monotone"
                                    name="Net Balance"
                                    dataKey="Balance"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ stroke: '#6366f1', strokeWidth: 2, r: 5, fill: '#06b6d4', fillOpacity: 1 }}
                                    activeDot={{ stroke: '#6366f1', strokeWidth: 2, r: 7, fill: '#06b6d4', fillOpacity: 1 }}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default FinanceLineChart;
