import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Wallet } from "lucide-react";
import {
    FaChartPie,
    FaMoneyBillWave,
    FaLightbulb,
    FaBullseye,
    FaHome,
    FaSignOutAlt,
    FaDownload,
} from "react-icons/fa";

import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { ScanLine } from "lucide-react";
import { ENABLE_BUDGETS } from "../../context/FinanceContext";
import { usePWA } from "../../hooks/usePWA";
import UserAvatar from "../common/UserAvatar";
import ProfileSettingsModal from "../modals/ProfileSettingsModal";

const Sidebar = () => {
    const { closeSidebar } = useSidebar();
    const { user, logout } = useAuth();
    const { isInstallable, isSafariInstallable, installApp } = usePWA();

    const [avatarStyle, setAvatarStyle] = useState("gradient_indigo");
    const [sidebarDisplayName, setSidebarDisplayName] = useState("Guest User");
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    useEffect(() => {
        if (user) {
            const name = user.displayName || user.email?.split("@")[0] || "Guest User";
            setSidebarDisplayName(name);
            const savedStyle = localStorage.getItem(`avatar_style_${user.uid}`) || "gradient_indigo";
            setAvatarStyle(savedStyle);
        } else {
            setSidebarDisplayName("Guest User");
            const savedStyle = localStorage.getItem("avatar_style_guest") || "gradient_indigo";
            setAvatarStyle(savedStyle);
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Successfully logged out");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const links = [
        {
            path: "/",
            label: "Dashboard",
            icon: <FaHome className="w-5 h-5" />,
        },
        {
            path: "/transactions",
            label: "Transactions",
            icon: <FaMoneyBillWave className="w-5 h-5" />,
        },
        {
            path: "/analytics",
            label: "Analytics",
            icon: <FaChartPie className="w-5 h-5" />,
        },
        {
            path: "/insights",
            label: "AI Insights",
            icon: <FaLightbulb className="w-5 h-5" />,
        },
        {
            path: "/goals",
            label: "Goals",
            icon: <FaBullseye className="w-5 h-5" />,
        },
        ENABLE_BUDGETS && {
            path: "/budgets",
            label: "Budgets",
            icon: <Wallet className="w-5 h-5" />,
        },
        {
            path: "/ocr",
            label: "UPI Scanner",
            icon: <ScanLine className="w-5 h-5" />,
        }
    ].filter(Boolean);

    return (
        <aside
            className="
                w-64
                min-h-screen
                flex
                flex-col
                border-r
                border-slate-200/40
                dark:border-slate-800/40
                bg-white/30
                dark:bg-[#070b16]/40
                backdrop-blur-xl
                transition-all
                duration-500
            "
        >
            {/* Logo */}
            <div className="p-6 h-20 flex items-center border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="flex items-center gap-3">
                    <div
                        className="
                        w-10
                        h-10
                        rounded-2xl
                        bg-gradient-to-tr
                        from-brand-500
                        to-indigo-600
                        flex
                        items-center
                        justify-center
                        text-white
                        font-black
                        text-xl
                        shadow-lg
                    "
                    >
                        F
                    </div>

                    <div>
                        <h1
                            className="
                            font-bold
                            text-lg
                            bg-gradient-to-r
                            from-slate-900
                            to-slate-700
                            dark:from-white
                            dark:to-slate-300
                            bg-clip-text
                            text-transparent
                        "
                        >
                            FinFlow
                        </h1>

                        <span
                            className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            text-brand-500
                            font-semibold
                        "
                        >
                            AI Dashboard
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-6 px-4 flex-1 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-2xl
                            text-sm
                            font-medium
                            transition-all
                            duration-300
                            group
                            ${isActive
                                ? "bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-lg"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white"
                            }
                        `
                        }
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Install App Promo Card */}
            {isInstallable && (
                <div className="mx-4 mb-2 p-4 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-indigo-600/10 border border-brand-500/10 hover:border-brand-500/25 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-1.5">
                        <FaDownload className="w-3.5 h-3.5 text-brand-500 dark:text-indigo-400 animate-pulse" />
                        FinFlow Desktop
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                        Install on your device for offline support & a native app experience.
                    </p>
                    <button
                        onClick={installApp}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 hover:from-brand-600 hover:to-indigo-700 text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        <FaDownload className="w-3.5 h-3.5" />
                        Install App
                    </button>
                </div>
            )}

            {/* iOS/Safari Install Helper Card */}
            {isSafariInstallable && (
                <div className="mx-4 mb-2 p-4 rounded-2xl bg-gradient-to-tr from-brand-500/10 to-indigo-600/10 border border-brand-500/10 hover:border-brand-500/25 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-1.5">
                        <FaDownload className="w-3.5 h-3.5 text-brand-500 dark:text-indigo-400" />
                        Install on Safari
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
                        Get the native app experience on macOS/iOS:
                    </p>
                    <ol className="text-[10px] text-slate-600 dark:text-slate-300 space-y-1.5 pl-3 list-decimal font-medium">
                        <li>Tap the **Share** button <span className="inline-block px-1 py-0.5 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[9px] font-bold">⎙</span> or menu.</li>
                        <li>Select **Add to Home Screen** (or **Add to Dock**).</li>
                    </ol>
                </div>
            )}

            {/* User Card */}
            <div
                className="
                p-3
                m-4
                rounded-2xl
                bg-slate-900/5
                dark:bg-white/5
                border
                border-slate-200/40
                dark:border-slate-800/40
                backdrop-blur-md
                flex
                items-center
                justify-between
                gap-3
            "
            >
                <div
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-3 min-w-0 cursor-pointer hover:bg-slate-950/5 dark:hover:bg-white/5 p-1 rounded-xl transition-all duration-300 flex-1 group"
                    title="Customize Profile"
                >
                    <UserAvatar
                        styleId={avatarStyle}
                        displayName={sidebarDisplayName}
                        sizeClass="w-10 h-10 text-sm group-hover:scale-105 transition-transform"
                    />

                    <div className="min-w-0">
                        <h4
                            className="
                            text-sm
                            font-semibold
                            text-slate-800
                            dark:text-slate-200
                            truncate
                            group-hover:text-brand-500
                            transition-colors
                        "
                        >
                            {sidebarDisplayName}
                        </h4>

                        <p
                            className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                            truncate
                        "
                        >
                            {user?.email || "guest@finflow.com"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        rounded-xl
                        text-slate-500
                        dark:text-slate-400
                        hover:text-red-500
                        hover:bg-red-500/10
                        transition-all
                    "
                >
                    <FaSignOutAlt className="w-4 h-4" />
                </button>
            </div>

            <ProfileSettingsModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
                currentDisplayName={sidebarDisplayName}
                currentStyleId={avatarStyle}
                onSave={(newName, newStyle) => {
                    setSidebarDisplayName(newName);
                    setAvatarStyle(newStyle);
                }}
            />
        </aside>
    );
};

export default Sidebar;