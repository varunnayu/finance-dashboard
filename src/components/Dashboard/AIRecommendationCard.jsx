import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { generateInsights } from "../../services/insightsEngine";

const SEVERITY_STYLES = {
    success: "border-emerald-500/20 bg-emerald-500/5",
    warning: "border-amber-500/20 bg-amber-500/5",
    danger: "border-red-500/20 bg-red-500/5",
    neutral: "border-slate-200/40 dark:border-white/5 bg-transparent",
};

const AIRecommendationCard = () => {
    const { transactions } = useFinance();
    const [currentIndex, setCurrentIndex] = useState(0);

    const insights = useMemo(() => generateInsights(transactions), [transactions]);

    const currentInsight = insights[currentIndex] || insights[0];

    const goNext = () => setCurrentIndex((prev) => (prev + 1) % insights.length);
    const goPrev = () => setCurrentIndex((prev) => (prev - 1 + insights.length) % insights.length);

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.005 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="glass-panel relative overflow-hidden p-6 border border-slate-200/40 dark:border-white/5 group"
        >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-brand-500 to-purple-600" />

            {/* Ambient background glow */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full blur-3xl opacity-20 bg-indigo-500 pointer-events-none" />

            <div className="relative z-10 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/40 dark:border-white/5">
                            <Sparkles className="w-5 h-5 text-brand-500 animate-pulse" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                                AI Insights
                            </span>
                            <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
                                Smart Analysis
                            </h3>
                        </div>
                    </div>

                    {/* Navigation arrows */}
                    {insights.length > 1 && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={goPrev}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                aria-label="Previous insight"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 min-w-[24px] text-center">
                                {currentIndex + 1}/{insights.length}
                            </span>
                            <button
                                onClick={goNext}
                                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                                aria-label="Next insight"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Insight Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25 }}
                        className={`p-4 rounded-2xl border ${SEVERITY_STYLES[currentInsight?.severity] || SEVERITY_STYLES.neutral}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">{currentInsight?.icon}</span>
                            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                {currentInsight?.text}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Pagination Dots */}
                {insights.length > 1 && (
                    <div className="flex justify-center gap-1.5 pt-1">
                        {insights.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                                    i === currentIndex
                                        ? "bg-brand-500 w-4"
                                        : "bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                                }`}
                                aria-label={`Go to insight ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AIRecommendationCard;