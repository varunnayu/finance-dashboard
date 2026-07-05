/**
 * UPI Parser — Extracts structured transaction data from raw OCR text.
 * Optimized for Indian UPI payment screenshots from PhonePe, Google Pay,
 * Paytm, BHIM, Amazon Pay, Cred, banking apps, and SMS screenshots.
 */

// ─── Payment App Detection ───────────────────────────────────────────
const PAYMENT_APP_PATTERNS = [
    { name: "PhonePe", keywords: ["phonepe", "phone pe", "phonepe.com"] },
    { name: "Google Pay", keywords: ["google pay", "gpay", "googlepay", "tez"] },
    { name: "Paytm", keywords: ["paytm", "paytm.com", "pay tm"] },
    { name: "BHIM", keywords: ["bhim", "bhim upi"] },
    { name: "Amazon Pay", keywords: ["amazon pay", "amazonpay", "amazon.in"] },
    { name: "Cred", keywords: ["cred", "cred upi", "cred.club"] },
    { name: "WhatsApp Pay", keywords: ["whatsapp pay", "whatsapp"] },
    { name: "Mobikwik", keywords: ["mobikwik"] },
    { name: "Freecharge", keywords: ["freecharge"] },
    { name: "SBI YONO", keywords: ["yono", "sbi yono"] },
    { name: "iMobile", keywords: ["imobile", "icici"] },
    { name: "HDFC", keywords: ["hdfc", "hdfcbank"] },
    { name: "Axis", keywords: ["axis bank", "axis pay"] },
    { name: "Banking App", keywords: ["bank", "netbanking", "mobile banking"] },
];

// ─── Bank Name Detection ──────────────────────────────────────────────
const BANK_PATTERNS = [
    "State Bank of India", "SBI", "HDFC Bank", "ICICI Bank",
    "Axis Bank", "Kotak Mahindra", "Yes Bank", "Punjab National",
    "Bank of Baroda", "Canara Bank", "Union Bank", "Indian Bank",
    "Bank of India", "Central Bank", "IDBI Bank", "Federal Bank",
    "IndusInd Bank", "RBL Bank", "Bandhan Bank", "IDFC First",
    "South Indian Bank", "Karur Vysya", "City Union Bank",
    "Karnataka Bank", "DCB Bank", "Fino", "Paytm Payments Bank",
    "Airtel Payments Bank", "Jio Payments Bank",
];

// ─── Core Parser ──────────────────────────────────────────────────────

/**
 * Parse raw OCR text from a UPI payment screenshot.
 * @param {string} rawText - The raw OCR extracted text.
 * @returns {object} Parsed transaction fields.
 */
export const parseUpiScreenshot = (rawText) => {
    if (!rawText || typeof rawText !== "string") {
        return getEmptyResult();
    }

    const text = rawText;
    const textLower = text.toLowerCase();
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    return {
        amount: extractAmount(text),
        type: detectTransactionType(textLower),
        merchant: extractMerchant(text, lines),
        upiId: extractUpiId(text),
        refNumber: extractRefNumber(text),
        date: extractDate(text),
        time: extractTime(text),
        paymentApp: detectPaymentApp(textLower),
        bankName: extractBankName(text),
        notes: extractNotes(text, lines),
    };
};

/**
 * Returns an empty parsed result for fallback.
 */
const getEmptyResult = () => ({
    amount: 0,
    type: "expense",
    merchant: "",
    upiId: "",
    refNumber: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    paymentApp: "",
    bankName: "",
    notes: "",
});

// ─── Amount Extraction ────────────────────────────────────────────────

const extractAmount = (text) => {
    // Strategy: find amounts in priority order
    const patterns = [
        // "₹ 1,234.56" or "₹1234.56" or "₹ 1234"
        /₹\s*([\d,]+(?:\.\d{1,2})?)/g,
        // "Rs. 1,234.56" or "Rs 1234" or "Rs.1234.00"
        /rs\.?\s*([\d,]+(?:\.\d{1,2})?)/gi,
        // "INR 1,234.56"
        /inr\s*([\d,]+(?:\.\d{1,2})?)/gi,
        // "Rupees 1,234"
        /rupees?\s*([\d,]+(?:\.\d{1,2})?)/gi,
        // "Amount: 1234" or "Amount ₹1234"
        /amount[:\s]*₹?\s*(?:rs\.?\s*)?([\d,]+(?:\.\d{1,2})?)/gi,
        // "Total: 1234" or "Total 1234.00"
        /total[:\s]*₹?\s*(?:rs\.?\s*)?([\d,]+(?:\.\d{1,2})?)/gi,
        // "Paid ₹1234" or "Received ₹1234"
        /(?:paid|received|sent|debited|credited)\s*₹?\s*(?:rs\.?\s*)?([\d,]+(?:\.\d{1,2})?)/gi,
    ];

    let candidates = [];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            const value = parseFloat(match[1].replace(/,/g, ""));
            if (value > 0 && value < 10000000) { // Up to 1 crore
                candidates.push(value);
            }
        }
    }

    // If no labeled amounts found, search for standalone currency values
    if (candidates.length === 0) {
        const fallback = /\b(\d{1,3}(?:,\d{3})*(?:\.\d{2}))\b/g;
        let match;
        while ((match = fallback.exec(text)) !== null) {
            const value = parseFloat(match[1].replace(/,/g, ""));
            if (value > 0 && value < 10000000) {
                candidates.push(value);
            }
        }
    }

    // Return the first significant amount (most likely the primary amount in the screenshot)
    // For most UPI screenshots, the prominent amount appears first
    if (candidates.length > 0) {
        // Filter out very small values that are likely subtotals or GST
        const significantAmounts = candidates.filter(c => c >= 1);
        return significantAmounts.length > 0 ? significantAmounts[0] : candidates[0];
    }

    return 0;
};

// ─── Transaction Type Detection ───────────────────────────────────────

const detectTransactionType = (textLower) => {
    // Income indicators (check first — more specific)
    const incomePatterns = [
        "received from", "received ₹", "received rs",
        "credited", "credit", "money received",
        "payment received", "cashback", "refund",
        "salary credited", "salary received",
        "received successfully", "has been credited",
        "you got", "you received",
        "transferred to your", "added to your",
    ];

    // Expense indicators
    const expensePatterns = [
        "paid to", "paid ₹", "paid rs",
        "debited", "debit", "money sent",
        "payment successful", "payment done", "sent to",
        "transfer successful", "transferred to",
        "you paid", "you sent",
        "has been debited", "deducted",
        "purchase", "charged",
    ];

    for (const pattern of incomePatterns) {
        if (textLower.includes(pattern)) return "income";
    }

    for (const pattern of expensePatterns) {
        if (textLower.includes(pattern)) return "expense";
    }

    // Default to expense (most screenshots are payment confirmations)
    return "expense";
};

// ─── Merchant Name Extraction ─────────────────────────────────────────

const extractMerchant = (text, lines) => {
    const textLower = text.toLowerCase();

    // Pattern 1: "Paid to [Name]" or "Sent to [Name]"
    const paidToMatch = text.match(/(?:paid to|sent to|transferred to|payment to)\s+(.+?)(?:\n|$)/i);
    if (paidToMatch) {
        const name = cleanMerchantName(paidToMatch[1]);
        if (name.length > 1) return name;
    }

    // Pattern 2: "Received from [Name]"
    const receivedMatch = text.match(/(?:received from|payment from|credited by|from)\s+(.+?)(?:\n|$)/i);
    if (receivedMatch) {
        const name = cleanMerchantName(receivedMatch[1]);
        if (name.length > 1) return name;
    }

    // Pattern 3: "To: [Name]" or "To [Name]"
    const toMatch = text.match(/^to[:\s]+(.+?)$/im);
    if (toMatch) {
        const name = cleanMerchantName(toMatch[1]);
        if (name.length > 1 && !name.match(/^\d+$/)) return name;
    }

    // Pattern 4: "From: [Name]" or "From [Name]"
    const fromMatch = text.match(/^from[:\s]+(.+?)$/im);
    if (fromMatch) {
        const name = cleanMerchantName(fromMatch[1]);
        if (name.length > 1 && !name.match(/^\d+$/)) return name;
    }

    // Pattern 5: Look for name near the UPI ID
    const upiLine = lines.find(l => l.includes("@"));
    if (upiLine) {
        const lineIndex = lines.indexOf(upiLine);
        // The merchant name is often the line before or after the UPI ID
        if (lineIndex > 0) {
            const prevLine = lines[lineIndex - 1];
            if (prevLine && prevLine.length > 2 && prevLine.length < 50 && !prevLine.match(/^\d+$/) && !prevLine.includes("₹")) {
                return cleanMerchantName(prevLine);
            }
        }
    }

    // Fallback: Use first non-trivial, non-date, non-number line
    for (let i = 0; i < Math.min(5, lines.length); i++) {
        const line = lines[i];
        if (
            line.length > 2 &&
            line.length < 50 &&
            !/^\d+$/.test(line) &&
            !line.includes("₹") &&
            !line.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/) &&
            !line.toLowerCase().includes("transaction") &&
            !line.toLowerCase().includes("payment") &&
            !line.toLowerCase().includes("successful")
        ) {
            return cleanMerchantName(line);
        }
    }

    return "";
};

const cleanMerchantName = (name) => {
    if (!name) return "";
    return name
        .replace(/[₹\$]/g, "")
        .replace(/\b\d{5,}\b/g, "") // Remove long numbers
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 50);
};

// ─── UPI ID Extraction ────────────────────────────────────────────────

const extractUpiId = (text) => {
    // UPI ID format: [alphanumeric.@_-]+@[provider]
    const upiMatch = text.match(/\b([\w.\-]+@[\w]+)\b/i);
    return upiMatch ? upiMatch[1].toLowerCase() : "";
};

// ─── Reference Number Extraction ──────────────────────────────────────

const extractRefNumber = (text) => {
    // Try various reference number patterns
    const patterns = [
        /(?:upi\s*ref(?:erence)?\.?\s*(?:no\.?|number|id)?[:\s]*)([\dA-Z]+)/i,
        /(?:utr\s*(?:no\.?|number)?[:\s]*)([\dA-Z]+)/i,
        /(?:transaction\s*id[:\s]*)([\dA-Z]+)/i,
        /(?:txn\s*(?:no\.?|id)?[:\s]*)([\dA-Z]+)/i,
        /(?:ref(?:erence)?\s*(?:no\.?|number|id)?[:\s]*)([\dA-Z]{6,})/i,
        /(?:order\s*id[:\s]*)([\dA-Z]+)/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1].length >= 6) {
            return match[1].trim();
        }
    }

    // Look for standalone 12-digit numbers that might be UTR
    const utrMatch = text.match(/\b(\d{12})\b/);
    if (utrMatch) return utrMatch[1];

    return "";
};

// ─── Date Extraction ──────────────────────────────────────────────────

const extractDate = (text) => {
    const today = new Date().toISOString().split("T")[0];

    // Pattern 1: "4 Jul 2026" or "04 July 2026" or "4th Jul 2026"
    const monthNames = {
        jan: "01", january: "01", feb: "02", february: "02",
        mar: "03", march: "03", apr: "04", april: "04",
        may: "05", jun: "06", june: "06",
        jul: "07", july: "07", aug: "08", august: "08",
        sep: "09", sept: "09", september: "09",
        oct: "10", october: "10", nov: "11", november: "11",
        dec: "12", december: "12",
    };

    const namedDateMatch = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{4})\b/i);
    if (namedDateMatch) {
        const day = namedDateMatch[1].padStart(2, "0");
        const month = monthNames[namedDateMatch[2].toLowerCase()];
        const year = namedDateMatch[3];
        if (month) return `${year}-${month}-${day}`;
    }

    // Pattern 1b: "Jul 4, 2026"
    const namedDateMatch2 = text.match(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/i);
    if (namedDateMatch2) {
        const month = monthNames[namedDateMatch2[1].toLowerCase()];
        const day = namedDateMatch2[2].padStart(2, "0");
        const year = namedDateMatch2[3];
        if (month) return `${year}-${month}-${day}`;
    }

    // Pattern 2: DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyyy = text.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/);
    if (ddmmyyyy) {
        const day = ddmmyyyy[1].padStart(2, "0");
        const month = ddmmyyyy[2].padStart(2, "0");
        const year = ddmmyyyy[3];
        if (parseInt(month) <= 12 && parseInt(day) <= 31) {
            return `${year}-${month}-${day}`;
        }
    }

    // Pattern 3: YYYY-MM-DD (ISO format)
    const isoDate = text.match(/\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/);
    if (isoDate) {
        return `${isoDate[1]}-${isoDate[2].padStart(2, "0")}-${isoDate[3].padStart(2, "0")}`;
    }

    // Pattern 4: DD/MM/YY
    const ddmmyy = text.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})\b/);
    if (ddmmyy) {
        const day = ddmmyy[1].padStart(2, "0");
        const month = ddmmyy[2].padStart(2, "0");
        const year = "20" + ddmmyy[3];
        if (parseInt(month) <= 12 && parseInt(day) <= 31) {
            return `${year}-${month}-${day}`;
        }
    }

    return today;
};

// ─── Time Extraction ──────────────────────────────────────────────────

const extractTime = (text) => {
    // "2:30 PM" or "14:30" or "2:30:45 PM"
    const time12 = text.match(/\b(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)\b/i);
    if (time12) {
        let hours = parseInt(time12[1]);
        const minutes = time12[2];
        const ampm = time12[4].toLowerCase();
        if (ampm === "pm" && hours !== 12) hours += 12;
        if (ampm === "am" && hours === 12) hours = 0;
        return `${String(hours).padStart(2, "0")}:${minutes}`;
    }

    // 24-hour format "14:30" or "14:30:45"
    const time24 = text.match(/\b(\d{2}):(\d{2})(?::(\d{2}))?\b/);
    if (time24) {
        const hours = parseInt(time24[1]);
        if (hours >= 0 && hours <= 23) {
            return `${time24[1]}:${time24[2]}`;
        }
    }

    return "";
};

// ─── Payment App Detection ────────────────────────────────────────────

const detectPaymentApp = (textLower) => {
    for (const app of PAYMENT_APP_PATTERNS) {
        for (const keyword of app.keywords) {
            if (textLower.includes(keyword)) {
                return app.name;
            }
        }
    }
    return "";
};

// ─── Bank Name Extraction ─────────────────────────────────────────────

const extractBankName = (text) => {
    const textLower = text.toLowerCase();
    for (const bank of BANK_PATTERNS) {
        if (textLower.includes(bank.toLowerCase())) {
            return bank;
        }
    }

    // Try to extract from UPI provider suffix
    const upiMatch = text.match(/\b[\w.\-]+@(\w+)\b/i);
    if (upiMatch) {
        const provider = upiMatch[1].toLowerCase();
        const providerBankMap = {
            ybl: "Yes Bank", okaxis: "Axis Bank", oksbi: "SBI",
            okhdfcbank: "HDFC Bank", okicici: "ICICI Bank",
            paytm: "Paytm Payments Bank", apl: "Axis Bank",
            ibl: "IDBI Bank", upi: "Unknown Bank",
            axl: "Axis Bank", sbi: "SBI",
            hdfcbank: "HDFC Bank", icici: "ICICI Bank",
            kotak: "Kotak Mahindra", federal: "Federal Bank",
            indus: "IndusInd Bank", rbl: "RBL Bank",
            boi: "Bank of India", pnb: "Punjab National Bank",
            cnrb: "Canara Bank", unionbank: "Union Bank",
        };
        if (providerBankMap[provider]) return providerBankMap[provider];
    }

    return "";
};

// ─── Notes Extraction ─────────────────────────────────────────────────

const extractNotes = (text, lines) => {
    // Look for "Message:", "Remarks:", "Note:", "Description:" fields
    const patterns = [
        /(?:message|remarks?|note|description|purpose)[:\s]+(.+?)(?:\n|$)/i,
        /(?:for)[:\s]+(.+?)(?:\n|$)/i,
    ];

    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            const note = match[1].trim();
            if (note.length > 1 && note.length < 200) {
                return note;
            }
        }
    }

    return "";
};
