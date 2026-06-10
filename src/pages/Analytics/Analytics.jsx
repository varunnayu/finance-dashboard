import React from "react";
import ExpensePieChart from "../../components/charts/ExpensePieChart";
import FinanceBarChart from "../../components/charts/FinanceBarChart";
import { motion } from "framer-motion";

const Analytics = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
        >
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                    Financial Analytics
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Visual insights of your income channels and expenditure categories.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ExpensePieChart />
                <FinanceBarChart />
            </div>
        </motion.div>
    );
};

export default Analytics;