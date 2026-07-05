import React, { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";
import { FaBars, FaRegBell, FaCloud, FaSync, FaExclamationTriangle, FaDownload } from "react-icons/fa";
import { useSidebar } from "../../context/SidebarContext";
import { useFinance, ENABLE_BUDGETS } from "../../context/FinanceContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePWA } from "../../hooks/usePWA";

const Navbar = () => {
    const { toggleSidebar, isSidebarOpen } = useSidebar();
    const { isOnline, isSyncing, syncQueueLength } = useFinance();
    const { isInstallable, installApp } = usePWA();
    const [showNotifications, setShowNotifications] = useState(false);
    const notifRef = useRef(null);

    // Close notifications on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="
            h-16
            sm:h-20
            px-4
            sm:px-6
            flex
            justify-between
            items-center
            bg-white/35
            dark:bg-[#070b16]/30
            backdrop-blur-xl
            border-b
            border-slate-200/40
            dark:border-slate-800/40
            transition-all
            duration-500
            sticky
            top-0
            z-30
        ">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <button
                    onClick={toggleSidebar}
                    className="
                        md:hidden
                        p-2.5
                        rounded-xl
                        text-slate-600
                        dark:text-slate-300
                        hover:bg-slate-100/50
                        dark:hover:bg-slate-800/35
                        transition-all
                        duration-300
                        flex-shrink-0
                        relative
                        w-10
                        h-10
                        flex
                        flex-col
                        justify-center
                        items-center
                        gap-[4px]
                        z-50
                    "
                    aria-label="Toggle Menu"
                >
                    <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 transform origin-center ${
                        isSidebarOpen ? "rotate-45 translate-y-[6px]" : ""
                    }`} />
                    <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 ${
                        isSidebarOpen ? "opacity-0" : "opacity-100"
                    }`} />
                    <span className={`w-5 h-[2px] bg-current rounded-full transition-all duration-300 transform origin-center ${
                        isSidebarOpen ? "-rotate-45 -translate-y-[6px]" : ""
                    }`} />
                </button>

                <h2 className="font-bold text-sm xs:text-base sm:text-lg md:text-xl tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent truncate">
                    AI Finance
                </h2>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Install App Button */}
                {isInstallable && (
                    <button
                        onClick={installApp}
                        className="
                            w-10
                            h-10
                            flex
                            items-center
                            justify-center
                            rounded-xl
                            bg-brand-500/10
                            dark:bg-brand-500/20
                            border
                            border-brand-500/20
                            text-brand-600
                            dark:text-brand-400
                            hover:bg-brand-500/20
                            dark:hover:bg-brand-500/30
                            hover:scale-105
                            active:scale-95
                            transition-all
                            duration-300
                            cursor-pointer
                            flex-shrink-0
                        "
                        title="Install App"
                    >
                        <FaDownload className="w-4 h-4 animate-bounce" style={{ animationDuration: "2s" }} />
                    </button>
                )}

                {/* Sync Status Badge */}
                <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 flex-shrink-0
                    ${isSyncing 
                        ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20 animate-pulse" 
                        : isOnline 
                            ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20"
                    }
                `} title={isSyncing ? "Syncing..." : isOnline ? "Cloud Synced" : `Offline: ${syncQueueLength} pending`}>
                    {isSyncing ? (
                        <FaSync className="w-4 h-4 animate-spin" />
                    ) : isOnline ? (
                        <FaCloud className="w-4 h-4" />
                    ) : (
                        <FaExclamationTriangle className="w-4 h-4 animate-bounce" />
                    )}
                </div>

                {/* Notifications Icon button dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="
                            w-10
                            h-10
                            flex
                            items-center
                            justify-center
                            rounded-xl
                            bg-white/40
                            dark:bg-white/5
                            border
                            border-slate-200/40
                            dark:border-white/5
                            text-slate-600
                            dark:text-slate-400
                            hover:bg-slate-100/50
                            dark:hover:bg-slate-800/40
                            transition-all
                            duration-300
                            relative
                            cursor-pointer
                        "
                        title="Notifications"
                    >
                        <FaRegBell className="w-4.5 h-4.5" />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-neon-rose shadow-[0_0_8px_#ff007f]" />
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 4, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="
                                    absolute
                                    right-0
                                    w-72
                                    mt-2
                                    rounded-2xl
                                    bg-white/80
                                    dark:bg-[#0b1021]/85
                                    backdrop-blur-xl
                                    border
                                    border-slate-200/40
                                    dark:border-white/5
                                    shadow-xl
                                    p-4
                                    z-50
                                "
                            >
                                <h3 className="font-bold text-xs text-slate-800 dark:text-white mb-2">Notifications</h3>
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {ENABLE_BUDGETS && (
                                        <div className="p-2.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                                            <div className="font-bold text-[10px] text-brand-500 mb-0.5">Budget Alert</div>
                                            Food expenses are at 85% of budget.
                                        </div>
                                    )}
                                    <div className="p-2.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                                        <div className="font-bold text-[10px] text-emerald-500 mb-0.5">Cloud Sync</div>
                                        Offline ledger queue synced successfully.
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                                        <div className="font-bold text-[10px] text-indigo-500 mb-0.5">AI Insights</div>
                                        New saving optimization path identified.
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Theme toggle */}
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Navbar;