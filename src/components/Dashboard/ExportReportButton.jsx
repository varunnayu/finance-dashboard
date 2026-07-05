import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Table, FileSpreadsheet, ChevronDown } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { exportCSV, exportExcel, exportPDF } from "../../services/exportService";
import toast from "react-hot-toast";

const EXPORT_OPTIONS = [
    {
        id: "pdf",
        label: "PDF Report",
        icon: <FileText className="w-4 h-4" />,
        description: "Formatted report with summary",
        color: "text-red-500",
    },
    {
        id: "csv",
        label: "CSV File",
        icon: <Table className="w-4 h-4" />,
        description: "Comma-separated values",
        color: "text-emerald-500",
    },
    {
        id: "excel",
        label: "Excel Workbook",
        icon: <FileSpreadsheet className="w-4 h-4" />,
        description: "Multi-sheet spreadsheet",
        color: "text-green-600",
    },
];

const ExportReportButton = () => {
    const { transactions, income, expense, balance } = useFinance();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleExport = (format) => {
        if (transactions.length === 0) {
            toast.error("No transactions to export.");
            setIsOpen(false);
            return;
        }

        const summary = { income, expense, balance };

        try {
            switch (format) {
                case "pdf":
                    exportPDF(transactions, summary);
                    toast.success("PDF report downloaded!");
                    break;
                case "csv":
                    exportCSV(transactions);
                    toast.success("CSV file downloaded!");
                    break;
                case "excel":
                    exportExcel(transactions, summary);
                    toast.success("Excel workbook downloaded!");
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Export failed:", error);
            toast.error("Export failed. Please try again.");
        }

        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className="
                    flex items-center gap-2 px-4 py-2.5 rounded-2xl
                    bg-gradient-to-r from-brand-500 to-indigo-600
                    hover:from-brand-600 hover:to-indigo-700
                    text-white text-xs font-bold
                    shadow-md shadow-brand-500/10
                    transition-all duration-300
                    cursor-pointer
                "
                id="export-report-btn"
            >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="
                            absolute right-0 mt-2 w-56 z-50
                            glass-panel p-2 border border-slate-200/40 dark:border-white/10
                            shadow-xl
                        "
                    >
                        {EXPORT_OPTIONS.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => handleExport(option.id)}
                                className="
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                                    text-left text-sm
                                    hover:bg-slate-100/60 dark:hover:bg-slate-800/40
                                    transition-all duration-200
                                    cursor-pointer
                                "
                                id={`export-${option.id}-btn`}
                            >
                                <span className={option.color}>{option.icon}</span>
                                <div>
                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-xs">{option.label}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{option.description}</p>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExportReportButton;