import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

const Dropdown = ({ value, onChange, options, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => 
        typeof opt === "object" ? opt.value === value : opt === value
    );
    const displayLabel = selectedOption 
        ? (typeof selectedOption === "object" ? selectedOption.label : selectedOption) 
        : value;

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="
                    w-full
                    glass-input
                    px-4
                    py-3
                    rounded-2xl
                    text-xs
                    text-left
                    text-slate-800
                    dark:text-white
                    dark:bg-slate-900/40
                    flex
                    items-center
                    justify-between
                    cursor-pointer
                    border
                    border-slate-200/40
                    dark:border-white/5
                    focus:outline-none
                    focus:ring-2
                    focus:ring-brand-500/20
                    transition-all
                    duration-300
                "
            >
                <span className="truncate">{displayLabel}</span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-slate-400 dark:text-slate-500 flex-shrink-0 ml-2"
                >
                    <FaChevronDown className="w-3 h-3" />
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="
                            absolute
                            z-50
                            left-0
                            right-0
                            max-h-60
                            overflow-y-auto
                            rounded-2xl
                            bg-white/80
                            dark:bg-[#0b1021]/80
                            backdrop-blur-xl
                            border
                            border-slate-200/40
                            dark:border-white/5
                            shadow-xl
                            py-1.5
                            focus:outline-none
                        "
                    >
                        {options.map((opt, index) => {
                            const optVal = typeof opt === "object" ? opt.value : opt;
                            const optLabel = typeof opt === "object" ? opt.label : opt;
                            const isSelected = optVal === value;

                            return (
                                <li
                                    key={index}
                                    onClick={() => {
                                        onChange(optVal);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        px-4
                                        py-2.5
                                        text-xs
                                        cursor-pointer
                                        transition-all
                                        duration-250
                                        flex
                                        items-center
                                        justify-between
                                        ${isSelected
                                            ? "text-brand-500 dark:text-brand-400 font-bold bg-brand-500/5 dark:bg-brand-500/10"
                                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/30"
                                        }
                                    `}
                                >
                                    <span className="truncate">{optLabel}</span>
                                </li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dropdown;
