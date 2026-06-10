import { motion, AnimatePresence } from "framer-motion";

const DeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white dark:bg-slate-800 rounded-xl p-6 w-[90%] max-w-md shadow-xl"
                        initial={{
                            scale: 0.8,
                            opacity: 0,
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                        }}
                        exit={{
                            scale: 0.8,
                            opacity: 0,
                        }}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            Delete Transaction
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete this transaction?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeleteModal;