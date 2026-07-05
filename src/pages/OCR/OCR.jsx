import React from "react";
import { motion } from "framer-motion";
import ReceiptScanner from "../../components/OCR/ReceiptScanner";
import { ScanLine, Smartphone } from "lucide-react";

const OCR = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                        <ScanLine className="w-8 h-8 text-brand-500" />
                        UPI Screenshot Scanner
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Upload payment screenshots from any UPI app — AI extracts and categorizes transactions automatically.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-500/5 border border-brand-500/10">
                    <Smartphone className="w-4 h-4 text-brand-500" />
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                        AI-Powered OCR
                    </span>
                </div>
            </div>

            <ReceiptScanner />
        </motion.div>
    );
};

export default OCR;