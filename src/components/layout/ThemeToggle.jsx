import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={toggleTheme}
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
                text-slate-700 
                dark:text-amber-400 
                hover:text-brand-500 
                dark:hover:text-amber-300
                shadow-sm
                transition-colors
                duration-300
                cursor-pointer
            "
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            >
                {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;