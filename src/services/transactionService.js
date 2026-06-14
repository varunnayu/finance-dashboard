import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export const addTransactionToFirestore = async (
    userId,
    transaction
) => {
    const docRef = await addDoc(
        collection(
            db,
            "users",
            userId,
            "transactions"
        ),
        transaction
    );

    return docRef.id;
};

export const getTransactionsFromFirestore =
    async (userId) => {
        const snapshot = await getDocs(
            collection(
                db,
                "users",
                userId,
                "transactions"
            )
        );

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    };

export const deleteTransactionFromFirestore =
    async (userId, transactionId) => {
        await deleteDoc(
            doc(
                db,
                "users",
                userId,
                "transactions",
                transactionId
            )
        );
    };

export const updateTransactionInFirestore =
    async (userId, transaction) => {
        await updateDoc(
            doc(
                db,
                "users",
                userId,
                "transactions",
                transaction.id
            ),
            transaction
        );
    };