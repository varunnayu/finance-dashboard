import React from "react";
import { FileDown } from "lucide-react";
import { motion } from "framer-motion";
import { useFinance } from "../../context/FinanceContext";
import { generatePDFReport } from "../../utils/generatePDFReport";

const ExportReportButton = () => {
    const {
        income,
        expense,
        balance,
        transactions,
    } = useFinance();

    const handleExport = () => {
        generatePDFReport({
            income,
            expense,
            balance,
            transactions,
        });
    };

    return (
        <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExport}
            className="
                flex
                items-center
                gap-2.5
                px-5
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-rose-500
                to-red-600
                hover:from-rose-600
                hover:to-red-700
                text-white
                font-extrabold
                text-xs
                uppercase
                tracking-wider
                shadow-lg
                shadow-rose-500/20
                hover:shadow-rose-500/35
                transition-all
                duration-300
                cursor-pointer
            "
        >
            <FileDown className="w-4 h-4" />
            <span>Export PDF Report</span>
        </motion.button>
    );
};

export default ExportReportButton;