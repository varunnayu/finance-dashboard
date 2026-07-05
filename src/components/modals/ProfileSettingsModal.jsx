import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaTimes, FaCheck } from "react-icons/fa";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import toast from "react-hot-toast";
import UserAvatar, { AVATAR_STYLES } from "../common/UserAvatar";

const ProfileSettingsModal = ({
    isOpen,
    onClose,
    user,
    currentDisplayName,
    currentStyleId,
    onSave,
}) => {
    const [name, setName] = useState("");
    const [selectedStyleId, setSelectedStyleId] = useState("gradient_indigo");
    const [saving, setSaving] = useState(false);

    // Initialize fields with current user state when opening
    useEffect(() => {
        if (isOpen) {
            setName(currentDisplayName || "");
            setSelectedStyleId(currentStyleId || "gradient_indigo");
        }
    }, [isOpen, currentDisplayName, currentStyleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error("Display name cannot be empty");
            return;
        }

        setSaving(true);
        try {
            // 1. Update Firebase User profile display name if logged in
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: name.trim(),
                });
            }

            // 2. Save Avatar style selection in localStorage
            if (user?.uid) {
                localStorage.setItem(`avatar_style_${user.uid}`, selectedStyleId);
            } else {
                localStorage.setItem("avatar_style_guest", selectedStyleId);
            }

            // 3. Callback to parent component
            if (onSave) {
                onSave(name.trim(), selectedStyleId);
            }

            toast.success("Profile updated successfully!");
            onClose();
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error(error.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div
                        className="glass-panel bg-white/95 dark:bg-[#080d1e]/95 border border-slate-200/50 dark:border-white/5 w-full max-w-[340px] shadow-2xl relative overflow-hidden"
                        initial={{ scale: 0.9, y: 15, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 15, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                    >
                        {/* Decorative Top Accent */}
                        <div className="h-[3px] bg-gradient-to-r from-brand-500 via-indigo-500 to-neon-rose w-full" />

                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 pb-3 border-b border-slate-200/40 dark:border-slate-800/40">
                            <div>
                                <h2 className="text-sm font-black text-slate-800 dark:text-white">
                                    Customize Profile
                                </h2>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Personalize your name & avatar style
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
                            >
                                <FaTimes className="w-3 h-3" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            {/* Live Preview Card */}
                            <div className="flex flex-col items-center justify-center py-3.5 px-3 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/40 dark:border-slate-800/40">
                                <UserAvatar
                                    styleId={selectedStyleId}
                                    displayName={name || "G"}
                                    sizeClass="w-12 h-12 text-lg shadow-md shadow-brand-500/10"
                                />
                                <h3 className="mt-2 font-bold text-xs text-slate-800 dark:text-white truncate max-w-[200px]">
                                    {name.trim() || "Guest User"}
                                </h3>
                                <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5 font-semibold">
                                    Live Preview
                                </p>
                            </div>

                            {/* Display Name Input */}
                            <div className="flex flex-col">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1 ml-1 uppercase tracking-wider">
                                    Display Name
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                                        <FaUser className="w-3 h-3" />
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="glass-input w-full pl-9 pr-3 py-2.5 rounded-lg text-[11px] text-slate-800 dark:text-white dark:bg-slate-900/40"
                                        maxLength={25}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Avatar Style Grid Selector */}
                            <div className="flex flex-col">
                                <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1 ml-1 uppercase tracking-wider">
                                    Select Avatar Style
                                </label>
                                <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto pr-1">
                                    {AVATAR_STYLES.map((style) => (
                                        <button
                                            key={style.id}
                                            type="button"
                                            onClick={() => setSelectedStyleId(style.id)}
                                            title={style.name}
                                            className={`
                                                p-1
                                                rounded-xl
                                                flex
                                                items-center
                                                justify-center
                                                border-2
                                                transition-all
                                                duration-300
                                                hover:scale-105
                                                ${selectedStyleId === style.id
                                                    ? "border-brand-500 bg-brand-500/10 dark:bg-brand-500/20 shadow-[0_0_8px_rgba(99,102,241,0.2)]"
                                                    : "border-transparent bg-slate-900/5 dark:bg-white/5 hover:border-slate-300 dark:hover:border-slate-700"
                                                }
                                            `}
                                        >
                                            <UserAvatar
                                                styleId={style.id}
                                                displayName={name || "G"}
                                                sizeClass="w-8 h-8 text-xs"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Action Buttons */}
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={saving}
                                    className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 active:scale-95 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white text-[10px] font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                                >
                                    {saving ? (
                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <FaCheck className="w-2.5 h-2.5" />
                                    )}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProfileSettingsModal;
