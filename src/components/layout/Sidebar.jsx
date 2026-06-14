import React from "react";
import { NavLink } from "react-router-dom";
import { Wallet } from "lucide-react";
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
import { ScanLine } from "lucide-react";

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

    const displayName =
        user?.displayName ||
        user?.email?.split("@")[0] ||
        "Guest User";

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
        {
            path: "/budgets",
            label: "Budgets",
            icon: <Wallet className="w-5 h-5" />,
        },
        {
            path: "/ocr",
            label: "Receipt Scanner",
            icon: <ScanLine className="w-5 h-5" />,
        }
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
                <div className="flex items-center gap-3 min-w-0">
                    <div
                        className="
                        w-10
                        h-10
                        rounded-xl
                        bg-gradient-to-tr
                        from-brand-500
                        to-indigo-600
                        flex
                        items-center
                        justify-center
                        text-white
                        font-bold
                    "
                    >
                        {displayName.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                        <h4
                            className="
                            text-sm
                            font-semibold
                            text-slate-800
                            dark:text-slate-200
                            truncate
                        "
                        >
                            {displayName}
                        </h4>

                        <p
                            className="
                            text-xs
                            text-slate-500
                            dark:text-slate-400
                            truncate
                        "
                        >
                            {user?.email}
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
        </aside>
    );
};

export default Sidebar;