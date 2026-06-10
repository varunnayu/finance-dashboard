import { motion } from "framer-motion";

const coins = Array.from({ length: 8 });

const Preloader = () => {
    return (
        <div
            className="
            fixed
            inset-0
            flex
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-sky-50
            via-white
            to-indigo-100
            z-[9999]
        "
        >
            {/* Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                }}
                className="
                absolute
                top-10
                left-10
                w-96
                h-96
                bg-blue-300/20
                rounded-full
                blur-3xl
            "
            />

            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                }}
                className="
                absolute
                bottom-10
                right-10
                w-96
                h-96
                bg-indigo-300/20
                rounded-full
                blur-3xl
            "
            />

            {/* Floating Coins */}
            {coins.map((_, index) => (
                <motion.div
                    key={index}
                    className="
                    absolute
                    text-yellow-500
                    text-3xl
                    font-bold
                "
                    initial={{
                        opacity: 0,
                        y: 50,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        y: [-20, -120],
                        rotate: 360,
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.4,
                    }}
                    style={{
                        left: `${15 + index * 10}%`,
                        bottom: "15%",
                    }}
                >
                    ₹
                </motion.div>
            ))}

            {/* Glass Card */}
            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.9,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                transition={{
                    duration: 0.6,
                }}
                className="
                backdrop-blur-xl
                bg-white/70
                border
                border-white/40
                rounded-3xl
                shadow-2xl
                p-10
                w-[350px]
                flex
                flex-col
                items-center
            "
            >
                {/* Main Coin */}
                <motion.div
                    animate={{
                        rotateY: 360,
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                    className="
                    w-24
                    h-24
                    rounded-full
                    bg-gradient-to-br
                    from-yellow-300
                    via-yellow-500
                    to-yellow-700
                    shadow-xl
                    flex
                    items-center
                    justify-center
                    text-white
                    text-4xl
                    font-bold
                "
                >
                    ₹
                </motion.div>

                {/* Title */}
                <motion.h1
                    className="
                    mt-6
                    text-3xl
                    font-bold
                    text-slate-800
                "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 0.2,
                    }}
                >
                    Finance Dashboard
                </motion.h1>

                <motion.p
                    className="
                    mt-2
                    text-slate-500
                "
                    animate={{
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                >
                    Loading your finances...
                </motion.p>

                {/* Progress Bar */}
                <div
                    className="
                    mt-8
                    w-full
                    h-3
                    bg-slate-200
                    rounded-full
                    overflow-hidden
                "
                >
                    <motion.div
                        className="
                        h-full
                        bg-gradient-to-r
                        from-blue-500
                        via-indigo-500
                        to-purple-500
                    "
                        initial={{
                            width: 0,
                        }}
                        animate={{
                            width: "100%",
                        }}
                        transition={{
                            duration: 2,
                        }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default Preloader;