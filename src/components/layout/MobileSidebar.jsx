import React from "react";
import Sidebar from "./Sidebar";
import { useSidebar } from "../../context/SidebarContext";
import { motion, AnimatePresence } from "framer-motion";

const MobileSidebar = () => {
    const { isSidebarOpen, closeSidebar } = useSidebar();

    return (
        <AnimatePresence>
            {isSidebarOpen && (
                <>
                    {/* Dark blurred glass backdrop overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={closeSidebar}
                        className="fixed inset-0 bg-black/35 backdrop-blur-sm z-40 md:hidden"
                    />

                    {/* Sliding Drawer Container */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                        className="fixed top-0 left-0 bottom-0 z-50 flex shadow-2xl md:hidden"
                    >
                        <Sidebar />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileSidebar;