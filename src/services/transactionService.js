import { ref, set, push, get, remove, update } from "firebase/database";
import { db } from "../firebase/firebase";

export const addTransactionToFirestore = async (userId, transaction) => {
    const newTxRef = push(ref(db, `users/${userId}/transactions`));
    await set(newTxRef, transaction);
    return newTxRef.key;
};

export const getTransactionsFromFirestore = async (userId) => {
    const snapshot = await get(ref(db, `users/${userId}/transactions`));
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.entries(data).map(([id, val]) => ({
        id,
        ...val,
    }));
};

export const deleteTransactionFromFirestore = async (userId, transactionId) => {
    await remove(ref(db, `users/${userId}/transactions/${transactionId}`));
};

export const updateTransactionInFirestore = async (userId, transaction) => {
    const { id, ...data } = transaction;
    await update(ref(db, `users/${userId}/transactions/${id}`), data);
};