import React from 'react';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
    return (
        <div className="relative flex min-h-screen overflow-hidden bg-slate-50 dark:bg-[#05070e] text-slate-800 dark:text-slate-100 transition-colors duration-500">

            {/* Glowing Liquid Background Blobs */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                {/* Blob 1 - Indigo Glow */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-500/20 to-purple-500/10 blur-[72px] dark:from-brand-500/10 dark:to-indigo-500/5 animate-blob-1" />

                {/* Blob 2 - Rose Gold Glow */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-neon-rose/15 to-amber-500/5 blur-[80px] dark:from-neon-rose/5 dark:to-purple-950/5 animate-blob-2" />

                {/* Blob 3 - Mint Cyan Glow */}
                <div className="absolute top-[40%] left-[45%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-neon-blue/15 to-teal-500/5 blur-[64px] dark:from-neon-blue/5 dark:to-indigo-950/5 animate-blob-3" />
            </div>

            {/* Sidebar Shell */}
            <div className="hidden md:block flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar overlay toggled by context */}
            <MobileSidebar />

            {/* Main Application Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                <Navbar />

                {/* Animate Page transitions */}
                <motion.main
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto"
                >
                    {children}
                </motion.main>
            </div>
        </div>
    );
};

export default Layout;