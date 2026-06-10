import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(() => {
        const stored = localStorage.getItem("transactions");
        return stored ? JSON.parse(stored) : [];
    });

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncQueue, setSyncQueue] = useState(() => {
        const stored = localStorage.getItem("sync_queue");
        return stored ? JSON.parse(stored) : [];
    });

    // Detect browser network connectivity shifts
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast.success("Network connection restored!");
        };
        const handleOffline = () => {
            setIsOnline(false);
            toast.error("Offline Mode activated. Working locally.");
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    // Perform batch synchronization once network connection is restored
    useEffect(() => {
        if (isOnline && syncQueue.length > 0) {
            const processSyncQueue = async () => {
                setIsSyncing(true);
                // Simulate cloud database upload latency
                await new Promise((resolve) => setTimeout(resolve, 1500));
                
                toast.success(`Cloud Synced: Uploaded ${syncQueue.length} offline operation(s)`);
                setSyncQueue([]);
                localStorage.removeItem("sync_queue");
                setIsSyncing(false);
            };
            processSyncQueue();
        }
    }, [isOnline, syncQueue]);

    const triggerDirectSync = () => {
        setIsSyncing(true);
        const timer = setTimeout(() => {
            setIsSyncing(false);
        }, 800);
        return () => clearTimeout(timer);
    };

    useEffect(() => {
        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );
    }, [transactions]);

    const addTransaction = (transaction) => {
        const newTransaction = {
            id: Date.now(),
            ...transaction,
        };
        setTransactions((prev) => [...prev, newTransaction]);

        if (!isOnline) {
            const queueItem = { action: "add", data: newTransaction };
            setSyncQueue((prev) => {
                const next = [...prev, queueItem];
                localStorage.setItem("sync_queue", JSON.stringify(next));
                return next;
            });
            toast.success("Saved to local offline cache");
        } else {
            triggerDirectSync();
        }
    };

    const deleteTransaction = (id) => {
        setTransactions((prev) => prev.filter((item) => item.id !== id));

        if (!isOnline) {
            const queueItem = { action: "delete", id };
            setSyncQueue((prev) => {
                const next = [...prev, queueItem];
                localStorage.setItem("sync_queue", JSON.stringify(next));
                return next;
            });
            toast.success("Deletion cached offline");
        } else {
            triggerDirectSync();
        }
    };

    const updateTransaction = (updatedTransaction) => {
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === updatedTransaction.id
                    ? updatedTransaction
                    : transaction
            )
        );

        if (!isOnline) {
            const queueItem = { action: "update", data: updatedTransaction };
            setSyncQueue((prev) => {
                const next = [...prev, queueItem];
                localStorage.setItem("sync_queue", JSON.stringify(next));
                return next;
            });
            toast.success("Edit cached offline");
        } else {
            triggerDirectSync();
        }
    };

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const balance = income - expense;

    return (
        <FinanceContext.Provider
            value={{
                transactions,
                addTransaction,
                deleteTransaction,
                updateTransaction,
                income,
                expense,
                balance,
                isOnline,
                isSyncing,
                syncQueueLength: syncQueue.length,
            }}
        >
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = () => {
    return useContext(FinanceContext);
};