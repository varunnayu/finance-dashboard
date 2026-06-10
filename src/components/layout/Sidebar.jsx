import React from "react";
import { NavLink } from "react-router-dom";
import {
    FaChartPie,
    FaMoneyBillWave,
    FaLightbulb,
    FaBullseye,
    FaHome,
    FaSignOutAlt,
} from "react-icons/fa";

import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = () => {
    const { closeSidebar } = useSidebar();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Successfully logged out");
        } catch (error) {
            toast.error("Logout failed");
        }
    };

    const displayName = user?.displayName || user?.email?.split("@")[0] || "Guest User";
    const links = [
        { path: "/", label: "Dashboard", icon: <FaHome className="w-5 h-5" /> },
        { path: "/transactions", label: "Transactions", icon: <FaMoneyBillWave className="w-5 h-5" /> },
        { path: "/analytics", label: "Analytics", icon: <FaChartPie className="w-5 h-5" /> },
        { path: "/insights", label: "AI Insights", icon: <FaLightbulb className="w-5 h-5" /> },
        { path: "/goals", label: "Goals", icon: <FaBullseye className="w-5 h-5" /> },
    ];

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
            {/* Header Brand */}
            <div className="p-6 h-20 flex items-center border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/30 dark:shadow-brand-500/10">
                        F
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            FinFlow
                        </h1>
                        <span className="text-[10px] text-brand-500 dark:text-brand-400 font-semibold tracking-wider uppercase">
                            AI Dashboard
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="mt-6 px-4 flex-1 space-y-1.5">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={closeSidebar}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 relative group
                            ${isActive
                                ? "text-white bg-gradient-to-r from-brand-500 to-indigo-600 shadow-md shadow-brand-500/20 dark:shadow-brand-500/10"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-800/20"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-brand-500"}`}>
                                    {link.icon}
                                </span>
                                <span className="relative z-10">{link.label}</span>
                                {!isActive && (
                                    <span className="absolute left-0 w-1 h-6 rounded-r bg-brand-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-center duration-300" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Sidebar Account & Logout */}
            <div className="p-3 m-4 rounded-2xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/40 dark:border-slate-800/40 backdrop-blur-md flex items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-brand-500/15 flex-shrink-0 select-none">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={displayName}>
                            {displayName}
                        </h4>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate" title={user?.email}>
                            {user?.email}
                        </span>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="
                        w-9
                        h-9
                        flex
                        items-center
                        justify-center
                        rounded-xl
                        bg-slate-900/5
                        dark:bg-white/5
                        hover:bg-rose-500/10
                        hover:text-rose-500
                        dark:hover:text-rose-400
                        text-slate-500
                        dark:text-slate-400
                        border
                        border-transparent
                        hover:border-rose-500/20
                        transition-all
                        duration-300
                        cursor-pointer
                        flex-shrink-0
                    "
                    title="Sign Out"
                >
                    <FaSignOutAlt className="w-4 h-4" />
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;