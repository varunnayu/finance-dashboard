import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    UploadCloud, FileText, CheckCircle, AlertTriangle, FileCheck2,
    Loader2, Sparkles, Plus, Image as ImageIcon, Camera, Clipboard,
    Shield, Zap, Clock, ChevronDown, ChevronUp, X, Copy, RefreshCw
} from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import toast from "react-hot-toast";
import { processScreenshot, getConfidenceLevel } from "../../services/upiOcrEngine";
import { learnMerchantCategory } from "../../services/aiClassifier";
import { checkDuplicate, getDuplicateReason } from "../../services/duplicateDetector";
import { maskUpiId } from "../../services/dataMasker";
import { CATEGORIES, CATEGORY_OPTIONS, getCategoryIcon } from "../../constants/categories";

// ─── Payment App Badges ──────────────────────────────────────────────
const PAYMENT_APP_COLORS = {
    "PhonePe": "from-purple-500 to-indigo-600",
    "Google Pay": "from-blue-500 to-green-500",
    "Paytm": "from-sky-400 to-blue-600",
    "BHIM": "from-green-600 to-emerald-700",
    "Amazon Pay": "from-yellow-500 to-orange-500",
    "Cred": "from-neutral-700 to-neutral-900",
    "WhatsApp Pay": "from-green-500 to-green-600",
    "Banking App": "from-blue-700 to-indigo-800",
};

// ─── Supported App Icons (for the drop zone) ─────────────────────────
const SUPPORTED_APPS = [
    { name: "PhonePe", color: "#5B2C8E" },
    { name: "GPay", color: "#4285F4" },
    { name: "Paytm", color: "#00B9F5" },
    { name: "BHIM", color: "#00695C" },
    { name: "Amazon", color: "#FF9900" },
    { name: "Cred", color: "#2D2D2D" },
];

const ReceiptScanner = () => {
    const { addTransaction, transactions } = useFinance();

    // ── State ──
    const [scanResult, setScanResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressLabel, setProgressLabel] = useState("");
    const [filePreview, setFilePreview] = useState(null);
    const [fileName, setFileName] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [showRawText, setShowRawText] = useState(false);
    const [duplicateWarning, setDuplicateWarning] = useState(null);
    const [editableFields, setEditableFields] = useState(null);
    const [processingTime, setProcessingTime] = useState(null);
    const [recentScans, setRecentScans] = useState(() => {
        try {
            const stored = localStorage.getItem("recent_scans");
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    // ── Save recent scans to localStorage ──
    useEffect(() => {
        localStorage.setItem("recent_scans", JSON.stringify(recentScans.slice(0, 5)));
    }, [recentScans]);

    // ── Clipboard paste handler (Ctrl+V) ──
    useEffect(() => {
        const handlePaste = (e) => {
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) handleFileProcess(file);
                    break;
                }
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);

    // ── Progress label mapping ──
    useEffect(() => {
        if (progress <= 10) setProgressLabel("Preparing image...");
        else if (progress <= 15) setProgressLabel("Enhancing contrast...");
        else if (progress <= 80) setProgressLabel("Reading text with OCR...");
        else if (progress <= 85) setProgressLabel("Parsing transaction data...");
        else if (progress <= 90) setProgressLabel("Classifying merchant...");
        else if (progress <= 95) setProgressLabel("Checking duplicates...");
        else setProgressLabel("Done!");
    }, [progress]);

    // ─── File Processing Pipeline ─────────────────────────────────────

    const handleFileProcess = useCallback(async (file) => {
        if (!file) return;

        // Reset state
        setScanResult(null);
        setEditableFields(null);
        setDuplicateWarning(null);
        setShowRawText(false);
        setFileName(file.name);
        setFilePreview(URL.createObjectURL(file));
        setLoading(true);
        setProgress(0);
        setProcessingTime(null);

        try {
            // Run the full OCR pipeline
            const result = await processScreenshot(file, (p) => setProgress(p));

            setScanResult(result);
            setProcessingTime(result.processingTime);

            // Initialize editable fields from the result
            setEditableFields({
                title: result.merchant || "Scanned Transaction",
                amount: result.amount,
                type: result.type,
                category: result.category,
                date: result.date,
                time: result.time,
                merchant: result.merchant,
                upiId: result.upiId,
                maskedUpiId: result.maskedUpiId,
                refNumber: result.refNumber,
                paymentApp: result.paymentApp,
                bankName: result.bankName,
                notes: result.notes,
            });

            // Check for duplicates
            const dupCheck = checkDuplicate(result, transactions);
            if (dupCheck.isDuplicate) {
                setDuplicateWarning({
                    ...dupCheck,
                    reason: getDuplicateReason(dupCheck.matchType),
                });
                toast.error("⚠️ Duplicate transaction detected!", { duration: 4000 });
            } else {
                // Show appropriate toast based on confidence
                if (result.needsReview) {
                    toast("⚡ Scanned! Please review the extracted details.", {
                        icon: "🔍",
                        duration: 3000,
                    });
                } else {
                    toast.success("✅ Screenshot scanned and classified successfully!", { duration: 3000 });
                }
            }
        } catch (error) {
            console.error("OCR Error:", error);
            toast.error(error.message || "Failed to process the screenshot.");
            setScanResult(null);
        } finally {
            setLoading(false);
        }
    }, [transactions]);

    // ─── Input Handlers ───────────────────────────────────────────────

    const handleFileInput = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFileProcess(file);
        e.target.value = ""; // Reset input
    };

    const handleCameraCapture = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFileProcess(file);
        e.target.value = "";
    };

    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileProcess(file);
    };

    const triggerFileSelect = () => fileInputRef.current?.click();
    const triggerCamera = () => cameraInputRef.current?.click();

    // ─── Field Edit Handler ───────────────────────────────────────────

    const handleFieldChange = (field, value) => {
        setEditableFields(prev => ({ ...prev, [field]: value }));
    };

    // ─── Save Transaction ─────────────────────────────────────────────

    const handleSaveTransaction = () => {
        if (!editableFields) return;

        if (!editableFields.title && !editableFields.merchant) {
            toast.error("Please enter a merchant name or title.");
            return;
        }
        if (!editableFields.amount || editableFields.amount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        const title = editableFields.title || editableFields.merchant || "Scanned Transaction";

        // Learn the merchant→category mapping if user changed it
        if (
            scanResult &&
            editableFields.category !== scanResult.category &&
            editableFields.merchant
        ) {
            learnMerchantCategory(editableFields.merchant, editableFields.category);
            toast.success(`📚 Learned: "${editableFields.merchant}" → ${editableFields.category}`, { duration: 3000 });
        }

        const transactionData = {
            title,
            amount: Number(editableFields.amount),
            category: editableFields.category,
            type: editableFields.type,
            date: editableFields.date || new Date().toISOString().split("T")[0],
            time: editableFields.time || "",
            merchant: editableFields.merchant || "",
            upiId: editableFields.upiId || "",
            refNumber: editableFields.refNumber || "",
            paymentApp: editableFields.paymentApp || "",
            bankName: editableFields.bankName || "",
            notes: editableFields.notes || "",
            ocrConfidence: scanResult?.ocrConfidence || 0,
            scanSource: "upi_screenshot",
        };

        addTransaction(transactionData);

        // Add to recent scans
        setRecentScans(prev => [{
            merchant: title,
            amount: transactionData.amount,
            type: transactionData.type,
            category: transactionData.category,
            paymentApp: transactionData.paymentApp,
            date: transactionData.date,
            timestamp: Date.now(),
        }, ...prev].slice(0, 5));

        const typeLabel = editableFields.type === "income" ? "Income detected" : "Expense added successfully";
        toast.success(`🎉 ${typeLabel}!`, { duration: 3000 });

        // Reset state for next scan
        resetScanner();
    };

    const resetScanner = () => {
        setScanResult(null);
        setEditableFields(null);
        setFilePreview(null);
        setFileName("");
        setDuplicateWarning(null);
        setShowRawText(false);
        setProgress(0);
        setProcessingTime(null);
    };

    // ─── Confidence Badge Component ───────────────────────────────────

    const ConfidenceBadge = ({ confidence, label }) => {
        const level = getConfidenceLevel(confidence);
        const colorMap = {
            emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
            amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
            orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
            red: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        };
        return (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${colorMap[level.color]}`}>
                {confidence >= 85 ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                {label || level.label} {confidence}%
            </span>
        );
    };

    // ─── Payment App Badge ────────────────────────────────────────────

    const PaymentAppBadge = ({ app }) => {
        if (!app) return null;
        const gradient = PAYMENT_APP_COLORS[app] || "from-slate-500 to-slate-600";
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r ${gradient}`}>
                {app}
            </span>
        );
    };

    // ═══════════════════════════════════════════════════════════════════
    // ─── RENDER ───────────────────────────────────────────────────────
    // ═══════════════════════════════════════════════════════════════════

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6 items-start">

                {/* ─── LEFT PANEL: Upload & Info ─────────────────────────── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Hidden file inputs */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                        ref={fileInputRef}
                        id="ocr-file-input"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCameraCapture}
                        className="hidden"
                        ref={cameraInputRef}
                        id="ocr-camera-input"
                    />

                    {/* ── Drop Zone ── */}
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={triggerFileSelect}
                        id="ocr-drop-zone"
                        className={`
                            glass-panel relative overflow-hidden p-8 border-2 border-dashed
                            text-center cursor-pointer transition-all duration-300 min-h-[280px]
                            flex flex-col items-center justify-center group
                            ${isDragging
                                ? "border-brand-500 bg-brand-500/5 shadow-2xl scale-[1.02]"
                                : "border-slate-300/40 dark:border-white/10 hover:border-brand-500/50 dark:hover:border-brand-500/30"}
                        `}
                    >
                        {/* Top accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500" />

                        {/* Scanner animation overlay */}
                        {loading && (
                            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                                <div className="absolute inset-x-0 w-full h-[3px] bg-brand-500 shadow-[0_0_16px_#6366f1,0_0_32px_#6366f1] animate-[scan_2s_infinite_ease-in-out]" />
                                <div className="absolute inset-0 bg-brand-500/3 backdrop-blur-[0.5px]" />
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
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-3 relative z-10 w-full"
                                >
                                    <div className="relative mx-auto max-w-[160px] rounded-2xl overflow-hidden shadow-lg border border-slate-200/30 dark:border-white/5">
                                        <img src={filePreview} alt="Screenshot preview" className="w-full object-contain" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        {loading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate px-4">{fileName}</p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                        {loading ? "Processing..." : "Click to replace image"}
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-4 relative z-10"
                                >
                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/10 to-purple-500/10 flex items-center justify-center text-brand-500 border border-brand-500/15 group-hover:scale-110 transition-transform duration-500">
                                        <UploadCloud className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
                                            Upload UPI Screenshot
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 px-4">
                                            Drag & drop, <span className="text-brand-500 font-bold">browse</span>, or press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-mono">Ctrl+V</kbd> to paste
                                        </p>
                                    </div>
                                    {/* Supported app pills */}
                                    <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                                        {SUPPORTED_APPS.map(app => (
                                            <span
                                                key={app.name}
                                                className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white/90"
                                                style={{ backgroundColor: app.color + "CC" }}
                                            >
                                                {app.name}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Progress bar overlay */}
                        {loading && (
                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 dark:bg-black/90 p-4 border-t border-white/10 z-30">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-500" />
                                            {progressLabel}
                                        </span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Action Buttons (Camera + Paste) ── */}
                    <div className="grid grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={triggerCamera}
                            className="glass-panel p-3 border border-slate-200/40 dark:border-white/5 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors cursor-pointer"
                            id="ocr-camera-btn"
                        >
                            <Camera className="w-4 h-4" />
                            Take Photo
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                navigator.clipboard.read().then(items => {
                                    for (const item of items) {
                                        for (const type of item.types) {
                                            if (type.startsWith("image/")) {
                                                item.getType(type).then(blob => {
                                                    const file = new File([blob], "pasted_screenshot.png", { type });
                                                    handleFileProcess(file);
                                                });
                                                return;
                                            }
                                        }
                                    }
                                    toast.error("No image found in clipboard.");
                                }).catch(() => {
                                    toast.error("Clipboard access denied. Try Ctrl+V instead.");
                                });
                            }}
                            className="glass-panel p-3 border border-slate-200/40 dark:border-white/5 flex items-center justify-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors cursor-pointer"
                            id="ocr-paste-btn"
                        >
                            <Clipboard className="w-4 h-4" />
                            Paste Image
                        </motion.button>
                    </div>

                    {/* ── Info Panel ── */}
                    <div className="glass-panel p-5 border border-slate-200/40 dark:border-white/5 space-y-3">
                        <div className="flex gap-3 items-start">
                            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 flex-shrink-0">
                                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">AI-Powered OCR Scanner</h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                    Upload screenshots from any UPI app. The AI extracts amount, merchant, date, and auto-categorizes the transaction. Works with dark mode, cropped, and blurred screenshots.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/20 dark:border-white/5">
                            <div className="text-center">
                                <Zap className="w-3.5 h-3.5 mx-auto text-amber-500 mb-1" />
                                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Fast OCR</span>
                            </div>
                            <div className="text-center">
                                <Shield className="w-3.5 h-3.5 mx-auto text-emerald-500 mb-1" />
                                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">Secure</span>
                            </div>
                            <div className="text-center">
                                <Clock className="w-3.5 h-3.5 mx-auto text-brand-500 mb-1" />
                                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400">{"<3s"}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Processing Result Summary ── */}
                    {scanResult && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-4 border border-slate-200/40 dark:border-white/5 space-y-3"
                        >
                            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                <FileCheck2 className="w-3.5 h-3.5" /> Scan Summary
                            </h4>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500">OCR Confidence</span>
                                    <div className="mt-0.5"><ConfidenceBadge confidence={scanResult.ocrConfidence} label="OCR" /></div>
                                </div>
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500">AI Category</span>
                                    <div className="mt-0.5"><ConfidenceBadge confidence={scanResult.categoryConfidence} label="AI" /></div>
                                </div>
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500">Processing</span>
                                    <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{processingTime}s</p>
                                </div>
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500">Payment App</span>
                                    <div className="mt-0.5">
                                        {scanResult.paymentApp ? (
                                            <PaymentAppBadge app={scanResult.paymentApp} />
                                        ) : (
                                            <span className="text-slate-500 text-[10px]">Not detected</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* ─── RIGHT PANEL: Results & Form ──────────────────────── */}
                <div className="lg:col-span-3 space-y-5">
                    <AnimatePresence mode="wait">
                        {editableFields ? (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-5"
                            >
                                {/* ── Duplicate Warning ── */}
                                {duplicateWarning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-panel p-4 border-2 border-amber-500/30 bg-amber-500/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-orange-500" />
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-extrabold text-amber-700 dark:text-amber-400">
                                                    Duplicate Transaction Detected
                                                </h4>
                                                <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-1">
                                                    {duplicateWarning.reason}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-2">
                                                    You can still save it using the button below, or scan a different screenshot.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Review Banner (low confidence) ── */}
                                {scanResult?.needsReview && !duplicateWarning && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-panel p-4 border border-amber-500/20 bg-amber-500/5 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 to-orange-400" />
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                                            <div>
                                                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400">
                                                    Manual Review Recommended
                                                </h4>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    OCR confidence is below 85%. Please verify the extracted details before saving.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Transaction Preview Card ── */}
                                <div className="glass-panel p-5 border border-slate-200/40 dark:border-white/5 relative overflow-hidden">
                                    <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${editableFields.type === "income" ? "from-emerald-500 to-teal-500" : "from-rose-500 to-orange-500"}`} />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${editableFields.type === "income"
                                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                                }`}>
                                                {getCategoryIcon(editableFields.category)}
                                            </div>
                                            <div>
                                                <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                                                    {editableFields.title || editableFields.merchant || "Transaction"}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/10">
                                                        {editableFields.category}
                                                    </span>
                                                    {editableFields.paymentApp && <PaymentAppBadge app={editableFields.paymentApp} />}
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                                                        {editableFields.date} {editableFields.time && `• ${editableFields.time}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xl font-black tracking-tight ${editableFields.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                                                {editableFields.type === "income" ? "+" : "-"} ₹{Number(editableFields.amount || 0).toLocaleString("en-IN")}
                                            </span>
                                            <span className={`block text-[10px] font-bold mt-0.5 ${editableFields.type === "income" ? "text-emerald-500/70" : "text-rose-500/70"}`}>
                                                {editableFields.type === "income" ? "INCOME" : "EXPENSE"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Editable Form ── */}
                                <div className="glass-panel p-6 border border-slate-200/40 dark:border-white/5 relative overflow-hidden space-y-4">
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />

                                    <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                                        <FileCheck2 className="w-4 h-4 text-brand-500" />
                                        Extracted Details
                                        {scanResult && (
                                            <ConfidenceBadge confidence={scanResult.overallConfidence} />
                                        )}
                                    </h3>

                                    {/* Row 1: Merchant + Amount */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Merchant / Title
                                            </label>
                                            <input
                                                type="text"
                                                value={editableFields.title}
                                                onChange={(e) => handleFieldChange("title", e.target.value)}
                                                className="glass-input w-full p-2.5 rounded-xl text-sm"
                                                id="ocr-field-title"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Amount (₹)
                                            </label>
                                            <input
                                                type="number"
                                                value={editableFields.amount}
                                                onChange={(e) => handleFieldChange("amount", parseFloat(e.target.value) || 0)}
                                                className="glass-input w-full p-2.5 rounded-xl text-sm"
                                                id="ocr-field-amount"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 2: Category + Type */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Category
                                            </label>
                                            <select
                                                value={editableFields.category}
                                                onChange={(e) => handleFieldChange("category", e.target.value)}
                                                className="glass-input w-full p-2.5 rounded-xl text-xs bg-white/20 dark:bg-black/20 text-slate-700 dark:text-slate-200"
                                                id="ocr-field-category"
                                            >
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat.value} value={cat.value} className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
                                                        {cat.icon} {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                Transaction Type
                                            </label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleFieldChange("type", "income")}
                                                    className={`py-2.5 rounded-xl font-bold text-xs transition-all border cursor-pointer ${editableFields.type === "income"
                                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                                        : "bg-slate-50/50 dark:bg-slate-900/20 text-slate-500 border-slate-200/40 dark:border-slate-800/40"
                                                        }`}
                                                    id="ocr-type-income"
                                                >
                                                    Income
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFieldChange("type", "expense")}
                                                    className={`py-2.5 rounded-xl font-bold text-xs transition-all border cursor-pointer ${editableFields.type === "expense"
                                                        ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                                                        : "bg-slate-50/50 dark:bg-slate-900/20 text-slate-500 border-slate-200/40 dark:border-slate-800/40"
                                                        }`}
                                                    id="ocr-type-expense"
                                                >
                                                    Expense
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 3: Date + Time */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date</label>
                                            <input
                                                type="date"
                                                value={editableFields.date}
                                                onChange={(e) => handleFieldChange("date", e.target.value)}
                                                className="glass-input w-full p-2.5 rounded-xl text-sm"
                                                id="ocr-field-date"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Time</label>
                                            <input
                                                type="time"
                                                value={editableFields.time}
                                                onChange={(e) => handleFieldChange("time", e.target.value)}
                                                className="glass-input w-full p-2.5 rounded-xl text-sm"
                                                id="ocr-field-time"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 4: UPI Details */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">UPI Reference</label>
                                            <input
                                                type="text"
                                                value={editableFields.refNumber}
                                                onChange={(e) => handleFieldChange("refNumber", e.target.value)}
                                                className="glass-input w-full p-2.5 rounded-xl text-sm font-mono"
                                                placeholder="—"
                                                id="ocr-field-ref"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">UPI ID</label>
                                            <input
                                                type="text"
                                                value={editableFields.maskedUpiId || maskUpiId(editableFields.upiId)}
                                                readOnly
                                                className="glass-input w-full p-2.5 rounded-xl text-sm font-mono bg-slate-50/30 dark:bg-slate-800/20 cursor-not-allowed"
                                                placeholder="—"
                                                id="ocr-field-upi"
                                            />
                                        </div>
                                    </div>

                                    {/* Row 5: Bank + Notes */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Bank</label>
                                            <input
                                                type="text"
                                                value={editableFields.bankName}
                                                onChange={(e) => handleFieldChange("bankName", e.target.value)}
                                                className="glass-input w-full p-2.5 rounded-xl text-sm"
                                                placeholder="—"
                                                id="ocr-field-bank"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Notes</label>
                                            <input
                                                type="text"
                                                value={editableFields.notes}
                                                onChange={(e) => handleFieldChange("notes", e.target.value)}
                                                className="glass-input w-full p-2.5 rounded-xl text-sm"
                                                placeholder="Add notes..."
                                                id="ocr-field-notes"
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <motion.button
                                            whileHover={{ scale: 1.02, y: -1 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleSaveTransaction}
                                            className={`
                                                flex-1 py-3.5 rounded-xl text-white font-extrabold text-sm
                                                shadow-lg transition-all duration-300 cursor-pointer
                                                flex items-center justify-center gap-2
                                                ${editableFields.type === "income"
                                                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-emerald-500/20"
                                                    : "bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 shadow-brand-500/20"
                                                }
                                            `}
                                            id="ocr-save-btn"
                                        >
                                            <Plus className="w-4 h-4" />
                                            {duplicateWarning ? "Save Anyway" : "Confirm & Save"}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={resetScanner}
                                            className="px-5 py-3.5 rounded-xl font-bold text-sm bg-slate-100/60 dark:bg-slate-800/30 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/40 dark:border-white/5 transition-all cursor-pointer flex items-center gap-2"
                                            id="ocr-reset-btn"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Reset
                                        </motion.button>
                                    </div>
                                </div>

                                {/* ── Raw OCR Text (Collapsible) ── */}
                                <div className="glass-panel border border-slate-200/40 dark:border-white/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-500/50" />
                                    <button
                                        onClick={() => setShowRawText(!showRawText)}
                                        className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                        id="ocr-raw-toggle"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <FileText className="w-4 h-4" />
                                            Raw OCR Output
                                        </span>
                                        {showRawText ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </button>
                                    <AnimatePresence>
                                        {showRawText && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-4">
                                                    <div className="rounded-xl bg-slate-100/50 dark:bg-black/40 p-4 border border-slate-200/20 dark:border-white/5 text-[10px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed select-text max-h-[250px] overflow-y-auto">
                                                        {scanResult?.rawText || "No text detected."}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="glass-panel p-10 text-center border border-slate-200/40 dark:border-white/5 flex flex-col items-center justify-center min-h-[360px]"
                            >
                                <div className="p-5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/20 dark:border-white/5 text-slate-400 dark:text-slate-500 mb-5">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                                <h3 className="text-lg font-extrabold text-slate-700 dark:text-slate-200 mb-2">
                                    UPI Scanner Ready
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed mx-auto">
                                    Upload a payment screenshot from PhonePe, Google Pay, Paytm, BHIM, or any UPI app.
                                    The AI will extract and classify the transaction automatically.
                                </p>
                                <div className="flex flex-wrap justify-center gap-2 mt-6">
                                    {SUPPORTED_APPS.map(app => (
                                        <span
                                            key={app.name}
                                            className="px-3 py-1 rounded-full text-[10px] font-bold text-white/90"
                                            style={{ backgroundColor: app.color + "BB" }}
                                        >
                                            {app.name}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ─── Recent Scans ─────────────────────────────────────────── */}
            {recentScans.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-5 border border-slate-200/40 dark:border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-purple-500" />
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Recent Scans
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {recentScans.map((scan, i) => (
                            <div
                                key={scan.timestamp || i}
                                className="p-3 rounded-xl bg-white/20 dark:bg-white/2 border border-slate-200/20 dark:border-white/5 flex items-center gap-3"
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${scan.type === "income"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-rose-500/10 text-rose-600"
                                    }`}>
                                    {getCategoryIcon(scan.category)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                                        {scan.merchant}
                                    </p>
                                    <p className={`text-[10px] font-bold ${scan.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                                        {scan.type === "income" ? "+" : "-"}₹{Number(scan.amount).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ReceiptScanner;