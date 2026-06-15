import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaGoogle, FaUserCircle, FaMicrochip } from "react-icons/fa";
import toast from "react-hot-toast";

const Login = () => {
    const { loginAsDemo } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Welcome back!");
            navigate("/");
        } catch (error) {
            toast.error(error.message || "Failed to log in");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            toast.success("Welcome back!");
            navigate("/");
        } catch (error) {
            toast.error(error.message || "Google Login failed");
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

            {/* Login Card Form */}
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
                        Sign In to FinFlow
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 text-center">
                        Access your AI-augmented financial dashboard.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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
                        {loading ? "Authenticating..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-5 flex items-center justify-center">
                    <div className="border-t border-slate-200/50 dark:border-white/5 w-full absolute" />
                    <span className="bg-slate-50 dark:bg-[#070b15] px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider relative z-10">
                        Or Connect with
                    </span>
                </div>

                <div className="space-y-3">
                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="
                            w-full
                            py-3
                            rounded-2xl
                            font-bold
                            text-xs
                            text-slate-700
                            dark:text-slate-300
                            bg-white/40
                            dark:bg-white/5
                            hover:bg-slate-100/50
                            dark:hover:bg-slate-800/40
                            border
                            border-slate-200/50
                            dark:border-white/5
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition-all
                            cursor-pointer
                        "
                    >
                        <FaGoogle className="text-rose-500 w-3.5 h-3.5" />
                        <span>Google Sign In</span>
                    </button>

                    {/* Guest / Demo Sign In */}
                    <button
                        onClick={() => {
                            loginAsDemo();
                            toast.success("Welcome! Signed in as Guest");
                            navigate("/");
                        }}
                        type="button"
                        className="
                            w-full
                            py-3
                            rounded-2xl
                            font-bold
                            text-xs
                            text-white
                            bg-gradient-to-r
                            from-violet-600
                            to-fuchsia-600
                            hover:from-violet-700
                            hover:to-fuchsia-700
                            shadow-lg
                            shadow-violet-500/15
                            flex
                            items-center
                            justify-center
                            gap-2
                            transition-all
                            cursor-pointer
                        "
                    >
                        <FaMicrochip className="text-white w-3.5 h-3.5" />
                        <span>Sign In as Guest (Demo)</span>
                    </button>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-6">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-brand-500 dark:text-brand-400 font-bold hover:underline">
                        Create one here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;