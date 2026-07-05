import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

import {
    addTransactionToFirestore,
    getTransactionsFromFirestore,
    deleteTransactionFromFirestore,
    updateTransactionInFirestore,
} from "../services/transactionService";

export const ENABLE_BUDGETS = false;

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
    const { user } = useAuth();
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

    // Load user-specific transactions from Firestore or local storage fallback
    useEffect(() => {
        const loadUserTransactions = async () => {
            if (user) {
                if (isOnline) {
                    try {
                        setIsSyncing(true);
                        let data = await getTransactionsFromFirestore(user.uid);

                        // Check for unsynced local anonymous transactions
                        const localAnon = localStorage.getItem("transactions");
                        if (localAnon) {
                            const parsedAnon = JSON.parse(localAnon);
                            if (parsedAnon.length > 0) {
                                toast.loading("Syncing local transactions to your cloud account...", { id: "sync-anon-toast" });
                                for (const t of parsedAnon) {
                                    const { id, ...cleanT } = t;
                                    await addTransactionToFirestore(user.uid, cleanT);
                                }
                                // Clear anonymous local storage key to prevent duplicate syncs
                                localStorage.removeItem("transactions");
                                // Refetch updated list
                                data = await getTransactionsFromFirestore(user.uid);
                                toast.success("Successfully synced local transactions!", { id: "sync-anon-toast" });
                            }
                        }

                        setTransactions(data);
                    } catch (error) {
                        console.error("Error loading transactions from Firestore:", error);
                        toast.error("Failed to load cloud transactions. Using local cache.");
                        const stored = localStorage.getItem(`transactions_${user.uid}`);
                        setTransactions(stored ? JSON.parse(stored) : []);
                    } finally {
                        setIsSyncing(false);
                    }
                } else {
                    const stored = localStorage.getItem(`transactions_${user.uid}`);
                    setTransactions(stored ? JSON.parse(stored) : []);
                }
            } else {
                const stored = localStorage.getItem("transactions");
                setTransactions(stored ? JSON.parse(stored) : []);
            }
        };

        loadUserTransactions();
    }, [user, isOnline]);

    // Save transactions to user-specific or general local storage
    useEffect(() => {
        if (user) {
            localStorage.setItem(
                `transactions_${user.uid}`,
                JSON.stringify(transactions)
            );
        } else {
            localStorage.setItem(
                "transactions",
                JSON.stringify(transactions)
            );
        }
    }, [transactions, user]);

    // Helper to add operation to sync queue
    const addToSyncQueue = (queueItem) => {
        setSyncQueue((prev) => {
            const next = [...prev, queueItem];
            localStorage.setItem("sync_queue", JSON.stringify(next));
            return next;
        });
    };

    // Perform batch synchronization once network connection is restored
    useEffect(() => {
        if (isOnline && syncQueue.length > 0 && user) {
            const processSyncQueue = async () => {
                setIsSyncing(true);
                toast.loading("Syncing offline changes with cloud...", { id: "sync-toast" });
                try {
                    for (const item of syncQueue) {
                        if (item.action === "add") {
                            await addTransactionToFirestore(user.uid, item.data);
                        } else if (item.action === "delete") {
                            await deleteTransactionFromFirestore(user.uid, item.id);
                        } else if (item.action === "update") {
                            await updateTransactionInFirestore(user.uid, item.data);
                        }
                    }
                    const syncedData = await getTransactionsFromFirestore(user.uid);
                    setTransactions(syncedData);
                    toast.success("Cloud Synced successfully!", { id: "sync-toast" });
                } catch (error) {
                    console.error("Error processing sync queue:", error);
                    toast.error("Failed to sync offline operations to cloud.", { id: "sync-toast" });
                } finally {
                    setSyncQueue([]);
                    localStorage.removeItem("sync_queue");
                    setIsSyncing(false);
                }
            };
            processSyncQueue();
        }
    }, [isOnline, syncQueue, user]);

    const triggerDirectSync = () => {
        setIsSyncing(true);
        const timer = setTimeout(() => {
            setIsSyncing(false);
        }, 800);
        return () => clearTimeout(timer);
    };

    const addTransaction = async (transaction) => {
        const tempId = Date.now();
        const newTransaction = {
            id: tempId,
            ...transaction,
        };
        setTransactions((prev) => [...prev, newTransaction]);

        if (user) {
            if (isOnline) {
                try {
                    triggerDirectSync();
                    const docId = await addTransactionToFirestore(user.uid, transaction);
                    setTransactions((prev) =>
                        prev.map((t) => (t.id === tempId ? { ...t, id: docId } : t))
                    );
                } catch (error) {
                    console.error("Firestore save failed, queuing:", error);
                    addToSyncQueue({ action: "add", data: transaction });
                }
            } else {
                addToSyncQueue({ action: "add", data: transaction });
                toast.success("Saved to local offline cache");
            }
        } else {
            if (!isOnline) {
                toast.success("Saved to local offline cache");
            }
        }
    };

    const deleteTransaction = async (id) => {
        setTransactions((prev) => prev.filter((item) => item.id !== id));

        if (user) {
            if (isOnline) {
                try {
                    triggerDirectSync();
                    await deleteTransactionFromFirestore(user.uid, id);
                } catch (error) {
                    console.error("Firestore delete failed, queuing:", error);
                    addToSyncQueue({ action: "delete", id });
                }
            } else {
                addToSyncQueue({ action: "delete", id });
                toast.success("Deletion cached offline");
            }
        } else {
            if (!isOnline) {
                toast.success("Deletion cached offline");
            }
        }
    };

    const updateTransaction = async (updatedTransaction) => {
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === updatedTransaction.id
                    ? updatedTransaction
                    : transaction
            )
        );

        if (user) {
            if (isOnline) {
                try {
                    triggerDirectSync();
                    await updateTransactionInFirestore(user.uid, updatedTransaction);
                } catch (error) {
                    console.error("Firestore update failed, queuing:", error);
                    addToSyncQueue({ action: "update", data: updatedTransaction });
                }
            } else {
                addToSyncQueue({ action: "update", data: updatedTransaction });
                toast.success("Edit cached offline");
            }
        } else {
            if (!isOnline) {
                toast.success("Edit cached offline");
            }
        }
    };

    const [budgets, setBudgets] = useState(() => {
        const saved = localStorage.getItem("budgets");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("budgets", JSON.stringify(budgets));
    }, [budgets]);

    const addBudget = (budget) => {
        const newBudget = {
            id: Date.now(),
            ...budget,
        };
        setBudgets((prev) => [...prev, newBudget]);
    };

    const deleteBudget = (id) => {
        setBudgets((prev) => prev.filter((budget) => budget.id !== id));
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

                budgets,
                addBudget,
                deleteBudget,

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