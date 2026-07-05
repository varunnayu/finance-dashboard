import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
    getTransactionsFromFirestore,
} from "../services/transactionService";

export const useFirestoreTransactions = () => {
    const { user } = useAuth();

    const [loading, setLoading] =
        useState(true);

    const [transactions, setTransactions] =
        useState([]);

    useEffect(() => {
        const loadTransactions = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const data =
                    await getTransactionsFromFirestore(
                        user.uid
                    );

                setTransactions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadTransactions();
    }, [user]);

    return {
        transactions,
        setTransactions,
        loading,
    };
};