import React from 'react';
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";
import { motion, AnimatePresence } from "framer-motion";

const Layout = ({ children }) => {
    return (
        <div className="relative flex h-screen overflow-hidden bg-slate-50 dark:bg-[#03050c] text-slate-800 dark:text-slate-100 transition-colors duration-500">

            {/* Glowing Liquid Background Blobs & SVG Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                {/* SVG High-Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)]" />

                {/* Blob 1 - Indigo Glow */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-brand-500/25 to-purple-500/15 blur-[90px] dark:from-brand-500/15 dark:to-indigo-500/10 animate-blob-1" />

                {/* Blob 2 - Rose Gold Glow */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-gradient-to-br from-neon-rose/20 to-amber-500/10 blur-[100px] dark:from-neon-rose/10 dark:to-purple-950/10 animate-blob-2" />

                {/* Blob 3 - Mint Cyan Glow */}
                <div className="absolute top-[35%] left-[35%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-neon-blue/20 to-teal-500/10 blur-[80px] dark:from-neon-blue/10 dark:to-indigo-950/10 animate-blob-3" />
            </div>

            {/* Sidebar Shell */}
            <div className="hidden md:block flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar overlay toggled by context */}
            <MobileSidebar />

            {/* Main Application Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen">
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