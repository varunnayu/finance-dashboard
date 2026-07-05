/**
 * Duplicate Detector — Prevents saving identical transactions.
 * Compares Amount + Date + Reference Number + UPI Transaction ID.
 */

/**
 * Generate a fingerprint hash for a transaction.
 * Uses amount + date + refNumber as the composite key.
 */
const generateFingerprint = (transaction) => {
    const amount = String(Number(transaction.amount) || 0);
    const date = String(transaction.date || "").trim();
    const refNumber = String(transaction.refNumber || "").trim().toLowerCase();
    const upiId = String(transaction.upiId || "").trim().toLowerCase();
    const time = String(transaction.time || "").trim();

    // Primary fingerprint: amount + date + ref number (strongest identifier)
    return `${amount}|${date}|${refNumber}|${time}|${upiId}`;
};

/**
 * Check if a transaction already exists in the transaction list.
 *
 * @param {object} newTransaction - The new transaction to check.
 * @param {Array} existingTransactions - List of existing transactions.
 * @returns {{ isDuplicate: boolean, existingTransaction?: object, matchType?: string }}
 */
export const checkDuplicate = (newTransaction, existingTransactions) => {
    if (!newTransaction || !Array.isArray(existingTransactions) || existingTransactions.length === 0) {
        return { isDuplicate: false };
    }

    const newAmount = Number(newTransaction.amount) || 0;
    const newDate = String(newTransaction.date || "").trim();
    const newRef = String(newTransaction.refNumber || "").trim().toLowerCase();
    const newTime = String(newTransaction.time || "").trim();

    for (const existing of existingTransactions) {
        const existAmount = Number(existing.amount) || 0;
        const existDate = String(existing.date || "").trim();
        const existRef = String(existing.refNumber || "").trim().toLowerCase();
        const existTime = String(existing.time || "").trim();

        // ── Exact match on Reference Number (strongest signal) ──
        if (newRef && existRef && newRef === existRef && newRef.length >= 6) {
            return {
                isDuplicate: true,
                existingTransaction: existing,
                matchType: "reference_number",
            };
        }

        // ── Match on Amount + Date + Time (strong signal) ──
        if (
            newAmount > 0 &&
            existAmount > 0 &&
            Math.abs(newAmount - existAmount) < 0.01 &&
            newDate === existDate &&
            newTime && existTime && newTime === existTime
        ) {
            return {
                isDuplicate: true,
                existingTransaction: existing,
                matchType: "amount_date_time",
            };
        }

        // ── Match on Amount + Date (moderate signal, only for OCR scans with ref) ──
        if (
            newRef &&
            newAmount > 0 &&
            existAmount > 0 &&
            Math.abs(newAmount - existAmount) < 0.01 &&
            newDate === existDate
        ) {
            // Only flag as duplicate if both have reference numbers OR exact same title
            if (
                (existRef && newRef === existRef) ||
                (existing.title && newTransaction.merchant &&
                 existing.title.toLowerCase() === newTransaction.merchant.toLowerCase())
            ) {
                return {
                    isDuplicate: true,
                    existingTransaction: existing,
                    matchType: "amount_date_merchant",
                };
            }
        }
    }

    return { isDuplicate: false };
};

/**
 * Generate a human-readable description of why a transaction was flagged as duplicate.
 * @param {string} matchType - The type of match from checkDuplicate.
 * @returns {string}
 */
export const getDuplicateReason = (matchType) => {
    switch (matchType) {
        case "reference_number":
            return "Same UPI reference number found in existing transactions.";
        case "amount_date_time":
            return "Same amount, date, and time found in existing transactions.";
        case "amount_date_merchant":
            return "Same amount, date, and merchant found in existing transactions.";
        default:
            return "This transaction appears to already exist.";
    }
};
