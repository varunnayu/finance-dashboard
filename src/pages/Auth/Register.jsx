import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaUser, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Account Created! Welcome to FinFlow.");
            navigate("/");
        } catch (error) {
            toast.error(error.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-[#05070e] transition-colors duration-500 overflow-hidden">
            {/* Ambient Background Blobs */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-15%] w-[450px] h-[450px] rounded-full bg-brand-500/20 blur-[100px] animate-blob-1" />
                <div className="absolute bottom-[-10%] right-[-15%] w-[500px] h-[500px] rounded-full bg-neon-rose/15 blur-[120px] animate-blob-2" />
            </div>

            {/* Register Card Form */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="glass-panel w-full max-w-md p-8 border border-slate-200/40 dark:border-white/5 relative shadow-2xl relative"
            >
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-indigo-600" />

                {/* Brand Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-brand-500/25 mb-3">
                        F
                    </div>
                    <h1 className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-white">
                        Create Account
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-center">
                        Launch your modern ledger profile today.
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Full Name</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                                <FaUser className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                placeholder="Varun K T"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="glass-input w-full pl-10 pr-4 py-3.5 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                                <FaEnvelope className="w-4 h-4" />
                            </span>
                            <input
                                type="email"
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="glass-input w-full pl-10 pr-4 py-3.5 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                                <FaLock className="w-4 h-4" />
                            </span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="glass-input w-full pl-10 pr-4 py-3.5 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="text-[10px] font-bold text-slate-400 mb-1 ml-1 uppercase">Confirm Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                                <FaCheck className="w-4 h-4" />
                            </span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="glass-input w-full pl-10 pr-4 py-3.5 rounded-2xl text-xs text-slate-800 dark:text-white dark:bg-slate-900/40"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                            w-full
                            py-3.5
                            rounded-2xl
                            font-bold
                            text-xs
                            text-white
                            bg-gradient-to-r
                            from-brand-500
                            to-indigo-600
                            hover:from-brand-600
                            hover:to-indigo-700
                            shadow-lg
                            shadow-brand-500/15
                            hover:scale-[1.01]
                            disabled:opacity-50
                            disabled:scale-100
                            transition-all
                            cursor-pointer
                            mt-2
                        "
                    >
                        {loading ? "Creating Profile..." : "Create Account"}
                    </button>
                </form>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-brand-500 dark:text-brand-400 font-bold hover:underline">
                        Sign In here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;