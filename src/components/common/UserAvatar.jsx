import React from "react";

export const AVATAR_STYLES = [
    {
        id: "gradient_indigo",
        name: "Brand Indigo",
        type: "initials",
        bgClass: "bg-gradient-to-tr from-brand-500 to-indigo-600",
        textClass: "text-white"
    },
    {
        id: "gradient_rose",
        name: "Sunset Rose",
        type: "initials",
        bgClass: "bg-gradient-to-tr from-rose-500 to-neon-rose",
        textClass: "text-white"
    },
    {
        id: "gradient_cyan",
        name: "Neon Mint",
        type: "initials",
        bgClass: "bg-gradient-to-tr from-cyan-400 to-emerald-500",
        textClass: "text-white"
    },
    {
        id: "neon",
        name: "Neon Cyberspace",
        type: "initials",
        bgClass: "bg-[#070b16] border border-neon-rose/50 shadow-[0_0_10px_rgba(255,0,127,0.25)] dark:bg-[#040810]",
        textClass: "text-neon-rose font-black"
    },
    {
        id: "glass",
        name: "Frosted Glass",
        type: "initials",
        bgClass: "bg-white/30 dark:bg-white/10 border border-slate-200/50 dark:border-white/10 backdrop-blur-md shadow-inner",
        textClass: "text-slate-800 dark:text-slate-200"
    },
    {
        id: "monochrome",
        name: "Minimalist Slate",
        type: "initials",
        bgClass: "bg-slate-900 dark:bg-slate-800 border border-slate-700/50",
        textClass: "text-slate-200"
    },
    {
        id: "emoji_wealth",
        name: "Fortune (💰)",
        type: "emoji",
        emoji: "💰",
        bgClass: "bg-gradient-to-tr from-emerald-400 to-teal-600 shadow-md shadow-emerald-500/10"
    },
    {
        id: "emoji_growth",
        name: "Hyper Growth (🚀)",
        type: "emoji",
        emoji: "🚀",
        bgClass: "bg-gradient-to-tr from-amber-400 to-rose-600 shadow-md shadow-rose-500/10"
    },
    {
        id: "emoji_ai",
        name: "Fin-AI (🤖)",
        type: "emoji",
        emoji: "🤖",
        bgClass: "bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-md shadow-cyan-500/10"
    },
    {
        id: "emoji_bold",
        name: "Roaring Ledger (🦁)",
        type: "emoji",
        emoji: "🦁",
        bgClass: "bg-gradient-to-tr from-rose-500 to-orange-500 shadow-md shadow-rose-500/10"
    }
];

const UserAvatar = ({
    styleId = "gradient_indigo",
    displayName = "Guest",
    sizeClass = "w-10 h-10 text-sm",
    className = "",
    onClick
}) => {
    // Find the style config
    const styleConfig = AVATAR_STYLES.find((s) => s.id === styleId) || AVATAR_STYLES[0];
    const initial = displayName ? displayName.trim().charAt(0).toUpperCase() : "G";

    return (
        <div
            onClick={onClick}
            className={`
                ${sizeClass}
                rounded-xl
                flex
                items-center
                justify-center
                flex-shrink-0
                select-none
                ${styleConfig.bgClass}
                ${onClick ? "cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300" : ""}
                ${className}
            `}
        >
            {styleConfig.type === "emoji" ? (
                <span className="leading-none text-[1.2em]">{styleConfig.emoji}</span>
            ) : (
                <span className={`font-bold ${styleConfig.textClass || ""}`}>{initial}</span>
            )}
        </div>
    );
};

export default UserAvatar;
