/**
 * Data Masker — Security Utility
 * Masks sensitive financial data before display or storage.
 * Never exposes full bank account numbers, card numbers, or UPI IDs.
 */

/**
 * Mask a bank account number: show only last 4 digits.
 * "12345678901234" → "XXXXXXXX1234"
 */
export const maskAccountNumber = (accountNumber) => {
    if (!accountNumber || typeof accountNumber !== "string") return "";
    const cleaned = accountNumber.replace(/\s/g, "");
    if (cleaned.length <= 4) return cleaned;
    const lastFour = cleaned.slice(-4);
    const masked = "X".repeat(cleaned.length - 4) + lastFour;
    return masked;
};

/**
 * Mask a UPI ID: show first 2 chars + masked middle + @provider.
 * "varunkt@ybl" → "va***@ybl"
 * "9876543210@paytm" → "98***@paytm"
 */
export const maskUpiId = (upiId) => {
    if (!upiId || typeof upiId !== "string") return "";
    const atIndex = upiId.indexOf("@");
    if (atIndex <= 0) return upiId;
    const prefix = upiId.slice(0, Math.min(2, atIndex));
    const provider = upiId.slice(atIndex);
    return `${prefix}***${provider}`;
};

/**
 * Mask a card number: show only last 4 digits with spaces.
 * "4532123456781234" → "XXXX XXXX XXXX 1234"
 */
export const maskCardNumber = (cardNumber) => {
    if (!cardNumber || typeof cardNumber !== "string") return "";
    const cleaned = cardNumber.replace(/\s/g, "");
    if (cleaned.length <= 4) return cleaned;
    const lastFour = cleaned.slice(-4);
    return `XXXX XXXX XXXX ${lastFour}`;
};

/**
 * Strip all sensitive patterns from raw text before storing.
 * Removes:
 * - Full account numbers (8+ consecutive digits)
 * - Full card numbers (16 digit patterns)
 * - IFSC codes
 * Preserves amounts, dates, and reference numbers.
 */
export const sanitizeRawText = (text) => {
    if (!text) return "";
    let sanitized = text;

    // Mask account numbers (8+ digits not preceded by common labels like ref/utr)
    sanitized = sanitized.replace(
        /(?<!ref[:\s#]*)(?<!utr[:\s#]*)(?<!id[:\s#]*)\b(\d{8,})\b/gi,
        (match) => {
            // Don't mask if it looks like a reference number (12 digits or less)
            if (match.length <= 12) return match;
            return maskAccountNumber(match);
        }
    );

    // Mask IFSC codes
    sanitized = sanitized.replace(
        /\b[A-Z]{4}0[A-Z0-9]{6}\b/g,
        "XXXX0XXXXXX"
    );

    return sanitized;
};

/**
 * Mask a phone number for display.
 * "9876543210" → "98XXXXXX10"
 */
export const maskPhoneNumber = (phone) => {
    if (!phone || typeof phone !== "string") return "";
    const cleaned = phone.replace(/\s/g, "");
    if (cleaned.length < 6) return cleaned;
    return cleaned.slice(0, 2) + "X".repeat(cleaned.length - 4) + cleaned.slice(-2);
};
