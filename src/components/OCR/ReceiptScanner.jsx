import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle, HelpCircle, FileCheck2, Loader2, Sparkles, Plus, Image as ImageIcon } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import toast from "react-hot-toast";

const PREDEFINED_CATEGORIES = [
    "Food",
    "Grocery",
    "Dining",
    "Bills",
    "Utilities",
    "Transport",
    "Travel",
    "Entertainment",
    "Housing",
    "Health",
    "Other"
];

// Helper parser to extract details using regex
const parseReceiptText = (rawText) => {
    const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);
    
    // 1. Guess merchant: usually the first non-trivial line
    let merchant = "Scanned Receipt Merchant";
    for (let i = 0; i < Math.min(3, lines.length); i++) {
        const line = lines[i];
        // Skip lines that look like date or numbers only
        if (line.length > 2 && !/^\d+$/.test(line) && !line.includes("/") && !line.includes("-")) {
            merchant = line;
            break;
        }
    }
    // Truncate to reasonable length
    if (merchant.length > 35) merchant = merchant.slice(0, 32) + "...";

    // 2. Guess total amount: search for largest decimal number on the receipt
    let amount = 0.0;
    const decimalRegex = /(?:total|amount|due|net|rs\.?|inr|₹|\$)?\s*:?\s*(?:rs\.?|inr|₹|\$)?\s*(\d+(?:\.\d{2}))/gi;
    let match;
    let candidates = [];
    while ((match = decimalRegex.exec(rawText)) !== null) {
        candidates.push(parseFloat(match[1]));
    }
    
    // If no exact decimals found, look for any standalone numbers
    if (candidates.length === 0) {
        const numberRegex = /\b\d+(?:\.\d{1,2})?\b/g;
        while ((match = numberRegex.exec(rawText)) !== null) {
            candidates.push(parseFloat(match[0]));
        }
    }
    
    if (candidates.length > 0) {
        // Find maximum number (usually Total is the largest amount on receipt, but let's limit it to avoid matching phone numbers or card numbers)
        const reasonableCandidates = candidates.filter(c => c > 0 && c < 500000);
        if (reasonableCandidates.length > 0) {
            amount = Math.max(...reasonableCandidates);
        }
    }

    // 3. Guess date: YYYY-MM-DD or DD/MM/YYYY
    let dateStr = new Date().toISOString().split("T")[0]; // default to today
    const dateRegex1 = /\b(\d{4})[-/](\d{1,2})[-/](\d{1,2})\b/; // YYYY-MM-DD
    const dateRegex2 = /\b(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})\b/; // DD/MM/YYYY or MM/DD/YYYY
    
    const m1 = rawText.match(dateRegex1);
    const m2 = rawText.match(dateRegex2);
    
    if (m1) {
        dateStr = `${m1[1]}-${String(m1[2]).padStart(2, "0")}-${String(m1[3]).padStart(2, "0")}`;
    } else if (m2) {
        let year = m2[3];
        if (year.length === 2) year = "20" + year;
        // Assume standard format DD/MM/YYYY
        dateStr = `${year}-${String(m2[2]).padStart(2, "0")}-${String(m2[1]).padStart(2, "0")}`;
    }

    // 4. Guess category based on keyword lists
    let category = "Other";
    const textLower = rawText.toLowerCase();
    
    const foodKeywords = ["food", "burger", "pizza", "starbucks", "cafe", "coffee", "restaurant", "dining", "bites", "bakery", "kitchen"];
    const groceryKeywords = ["grocery", "supermarket", "mart", "store", "d-mart", "reliance", "milk", "vegetables", "fruits", "whole foods"];
    const billKeywords = ["bill", "invoice", "electricity", "water", "broadband", "recharge", "airtel", "jio", "power", "internet"];
    const transportKeywords = ["transport", "cab", "taxi", "uber", "ola", "metro", "fuel", "petrol", "diesel", "parking"];
    const travelKeywords = ["travel", "flight", "hotel", "stay", "booking", "irctc", "railway"];

    if (foodKeywords.some(kw => textLower.includes(kw))) {
        category = "Dining";
    } else if (groceryKeywords.some(kw => textLower.includes(kw))) {
        category = "Grocery";
    } else if (billKeywords.some(kw => textLower.includes(kw))) {
        category = "Bills";
    } else if (transportKeywords.some(kw => textLower.includes(kw))) {
        category = "Transport";
    } else if (travelKeywords.some(kw => textLower.includes(kw))) {
        category = "Travel";
    }

    return {
        title: merchant,
        amount,
        date: dateStr,
        category,
        type: "expense"
    };
};

const ReceiptScanner = () => {
    const { addTransaction } = useFinance();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [filePreview, setFilePreview] = useState(null);
    const [fileName, setFileName] = useState("");
    const [parsedData, setParsedData] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    
    const fileInputRef = useRef(null);

    const handleFileProcess = async (file) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file (PNG, JPG, etc.)");
            return;
        }

        setFileName(file.name);
        setFilePreview(URL.createObjectURL(file));
        setLoading(true);
        setProgress(0);
        setText("");
        setParsedData(null);

        try {
            const result = await Tesseract.recognize(
                file,
                "eng",
                {
                    logger: (m) => {
                        if (m.status === "recognizing text") {
                            setProgress(Math.round(m.progress * 100));
                        }
                    }
                }
            );

            const ocrText = result.data.text;
            setText(ocrText);
            
            // Parse OCR results
            const parsed = parseReceiptText(ocrText);
            setParsedData(parsed);
            toast.success("Receipt scanned and parsed successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to parse the receipt image.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        handleFileProcess(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileProcess(file);
    };

    const handleFormChange = (field, value) => {
        setParsedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveTransaction = () => {
        if (!parsedData.title) {
            toast.error("Please enter a merchant name/title");
            return;
        }
        if (!parsedData.amount || parsedData.amount <= 0) {
            toast.error("Please enter a valid expense amount");
            return;
        }

        addTransaction({
            title: parsedData.title,
            amount: Number(parsedData.amount),
            date: parsedData.date,
            category: parsedData.category,
            type: parsedData.type
        });

        toast.success("Receipt transaction recorded in ledger!");
        
        // Reset state
        setText("");
        setFilePreview(null);
        setFileName("");
        setParsedData(null);
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6 items-start">
                
                {/* Upload & Scanning Workspaces */}
                <div className="lg:col-span-2 space-y-6">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        ref={fileInputRef}
                    />

                    {/* Drag and Drop Zone */}
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={triggerFileSelect}
                        className={`
                            glass-panel
                            relative
                            overflow-hidden
                            p-8
                            border-2
                            border-dashed
                            text-center
                            cursor-pointer
                            transition-all
                            duration-300
                            min-h-[260px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            ${isDragging 
                                ? "border-brand-500 bg-brand-500/5 shadow-2xl" 
                                : "border-slate-300/40 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20"}
                        `}
                    >
                        {/* Top styling bar */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />

                        {loading && (
                            /* Scanner laser scan line animation overlay */
                            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                                <div className="absolute inset-x-0 w-full h-[3px] bg-red-500 shadow-[0_0_12px_#ef4444] animate-[scan_2.5s_infinite_ease-in-out]" />
                                <div className="absolute inset-0 bg-red-500/5 backdrop-blur-[1px]" />
                                <style>{`
                                    @keyframes scan {
                                        0%, 100% { top: 0%; }
                                        50% { top: 100%; }
                                    }
                                `}</style>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {filePreview ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4 relative z-10 w-full"
                                >
                                    <div className="relative mx-auto max-w-[140px] rounded-xl overflow-hidden shadow-md border border-slate-200/50 dark:border-white/5 bg-slate-900">
                                        <img src={filePreview} alt="Receipt preview" className="w-full object-contain opacity-80" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate px-4">
                                            {fileName}
                                        </p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                            Click to replace image
                                        </p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4 relative z-10"
                                >
                                    <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/15 group-hover:scale-110 transition-transform duration-300">
                                        <UploadCloud className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
                                            Upload Receipt Image
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 px-6">
                                            Drag & drop your receipt here, or <span className="text-brand-500 font-bold">browse files</span>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* OCR Progress bar overlay */}
                        {loading && (
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 dark:bg-black/90 p-4 border-t border-slate-200/20 z-30">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" />
                                            Reading optical lines...
                                        </span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI explanation panel */}
                    <div className="glass-panel p-5 border border-slate-200/40 dark:border-white/5 flex gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 flex-shrink-0 self-start">
                            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-extrabold text-slate-700 dark:text-slate-200">Automated OCR Extraction</h4>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                Upload clean receipt photographs under consistent lighting. The AI system extracts values, guesses category groups, and populates the ledger draft instantly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Parsing Results Workstations */}
                <div className="lg:col-span-3 space-y-6">
                    <AnimatePresence mode="wait">
                        {parsedData ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid md:grid-cols-5 gap-6"
                            >
                                {/* Form parameters */}
                                <div className="md:col-span-3 glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden space-y-4">
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-indigo-600" />
                                    
                                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white flex items-center gap-2 mb-2">
                                        <FileCheck2 className="w-5 h-5 text-emerald-500" />
                                        Extracted Parameters
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Merchant / Title
                                            </label>
                                            <input
                                                type="text"
                                                value={parsedData.title}
                                                onChange={(e) => handleFormChange("title", e.target.value)}
                                                className="glass-input w-full p-2.5 rounded-xl text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                    Amount (INR)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={parsedData.amount}
                                                    onChange={(e) => handleFormChange("amount", parseFloat(e.target.value) || 0)}
                                                    className="glass-input w-full p-2.5 rounded-xl text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                    Transaction Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={parsedData.date}
                                                    onChange={(e) => handleFormChange("date", e.target.value)}
                                                    className="glass-input w-full p-2.5 rounded-xl text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                    Category Group
                                                </label>
                                                <select
                                                    value={parsedData.category}
                                                    onChange={(e) => handleFormChange("category", e.target.value)}
                                                    className="glass-input w-full p-2.5 rounded-xl text-xs bg-white/20 dark:bg-black/20 text-slate-700 dark:text-slate-200"
                                                >
                                                    {PREDEFINED_CATEGORIES.map((cat) => (
                                                        <option key={cat} value={cat} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                    Type
                                                </label>
                                                <select
                                                    value={parsedData.type}
                                                    onChange={(e) => handleFormChange("type", e.target.value)}
                                                    className="glass-input w-full p-2.5 rounded-xl text-xs bg-white/20 dark:bg-black/20 text-slate-700 dark:text-slate-200"
                                                >
                                                    <option value="expense" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">Expense</option>
                                                    <option value="income" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">Income</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.02, y: -1 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={handleSaveTransaction}
                                        className="
                                            w-full
                                            py-3
                                            rounded-xl
                                            bg-gradient-to-r
                                            from-emerald-500
                                            to-teal-600
                                            hover:from-emerald-600
                                            hover:to-teal-700
                                            text-white
                                            font-extrabold
                                            text-sm
                                            shadow-md
                                            shadow-emerald-500/10
                                            transition-all
                                            duration-300
                                            cursor-pointer
                                            mt-4
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                        "
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Confirm & Log Transaction</span>
                                    </motion.button>
                                </div>

                                {/* Raw scanned data logger box */}
                                <div className="md:col-span-2 glass-panel p-5 border border-slate-200/40 dark:border-white/5 relative overflow-hidden flex flex-col h-full max-h-[360px]">
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-500" />
                                    
                                    <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                        <FileText className="w-4 h-4" />
                                        Raw OCR Stream
                                    </h4>
                                    
                                    <div className="flex-1 overflow-y-auto rounded-lg bg-slate-100/50 dark:bg-black/40 p-3 border border-slate-200/20 dark:border-white/5 text-[10px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed select-text">
                                        {text || "No characters registered."}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass-panel p-10 text-center border border-slate-200/40 dark:border-white/5 flex flex-col items-center justify-center min-h-[300px]"
                            >
                                <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/20 dark:border-white/5 text-slate-400 dark:text-slate-500 mb-4">
                                    <ImageIcon className="w-10 h-10" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">
                                    Scanner Workstation Idle
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mx-auto">
                                    Upload or drag-and-drop a clear image of a paper receipt in the left panel to scan characters and compile transaction data.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default ReceiptScanner;