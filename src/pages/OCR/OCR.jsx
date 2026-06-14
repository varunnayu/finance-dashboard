import React from "react";
import { motion } from "framer-motion";
import ReceiptScanner from "../../components/OCR/ReceiptScanner";
import { ScanLine } from "lucide-react";

const OCR = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                    <ScanLine className="w-8 h-8 text-brand-500" />
                    Receipt Scanner Workstation
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Process paper receipt photos with optical character recognition (OCR) and save them to your ledger.
                </p>
            </div>

            <ReceiptScanner />
        </motion.div>
    );
};

export default OCR;