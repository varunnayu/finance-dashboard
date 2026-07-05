/**
 * AI Classifier — Intelligent Transaction Categorization
 * Maps merchants to categories using a dictionary + keyword matching + user learning.
 * User corrections are stored and prioritized for future classifications.
 */

// ─── Merchant → Category Dictionary (100+ Indian merchants) ──────────

const MERCHANT_CATEGORY_MAP = {
    // Food & Dining
    swiggy: "Food", zomato: "Food", "food panda": "Food", dunzo: "Food",
    "uber eats": "Food", dominos: "Food", "domino's": "Food",
    "pizza hut": "Food", mcdonalds: "Food", "mc donalds": "Food",
    "mcdonald's": "Food", kfc: "Food", "burger king": "Food",
    starbucks: "Food", "cafe coffee day": "Food", ccd: "Food",
    haldiram: "Food", barbeque: "Food", restaurant: "Food",
    cafe: "Food", "chai point": "Food", chaayos: "Food",
    subway: "Food", "taco bell": "Food", "biryani": "Food",

    // Groceries
    blinkit: "Groceries", instamart: "Groceries", bigbasket: "Groceries",
    "big basket": "Groceries", grofers: "Groceries", jiomart: "Groceries",
    "jio mart": "Groceries", dmart: "Groceries", "d mart": "Groceries",
    "d-mart": "Groceries", "reliance fresh": "Groceries",
    "reliance smart": "Groceries", "nature's basket": "Groceries",
    "more supermarket": "Groceries", "star bazaar": "Groceries",
    zepto: "Groceries", "country delight": "Groceries",
    grocery: "Groceries", supermarket: "Groceries", mart: "Groceries",
    "whole foods": "Groceries", "spencer's": "Groceries",

    // Transport
    uber: "Transport", ola: "Transport", rapido: "Transport",
    metro: "Transport", "metro card": "Transport", namma: "Transport",
    "auto rickshaw": "Transport", taxi: "Transport", cab: "Transport",
    "bus ticket": "Transport", ksrtc: "Transport", redbus: "Transport",
    "make my trip": "Transport",

    // Fuel
    petrol: "Fuel", diesel: "Fuel", "petrol pump": "Fuel",
    "indian oil": "Fuel", "hp petrol": "Fuel", "hindustan petroleum": "Fuel",
    "bharat petroleum": "Fuel", bpcl: "Fuel", iocl: "Fuel",
    hpcl: "Fuel", "fuel station": "Fuel", "shell petrol": "Fuel",

    // Utilities
    electricity: "Utilities", "water bill": "Utilities", "gas bill": "Utilities",
    "internet bill": "Utilities", broadband: "Utilities",
    "mobile recharge": "Utilities", recharge: "Utilities",
    airtel: "Utilities", jio: "Utilities", vi: "Utilities",
    vodafone: "Utilities", bsnl: "Utilities", "act fibernet": "Utilities",
    "tata sky": "Utilities", "dish tv": "Utilities", "d2h": "Utilities",
    "piped gas": "Utilities", "mahanagar gas": "Utilities",
    "indraprastha gas": "Utilities",

    // Entertainment
    netflix: "Entertainment", "prime video": "Entertainment",
    "amazon prime": "Entertainment", "disney+": "Entertainment",
    hotstar: "Entertainment", spotify: "Entertainment",
    "apple music": "Entertainment", "youtube premium": "Entertainment",
    "youtube music": "Entertainment", "sony liv": "Entertainment",
    "zee5": "Entertainment", "jio cinema": "Entertainment",
    bookmyshow: "Entertainment", "book my show": "Entertainment",
    pvr: "Entertainment", inox: "Entertainment", cinema: "Entertainment",
    "amusement park": "Entertainment", gaming: "Entertainment",

    // Healthcare
    "medical store": "Healthcare", pharmacy: "Healthcare",
    hospital: "Healthcare", "apollo pharmacy": "Healthcare",
    "medplus": "Healthcare", "1mg": "Healthcare", "pharmeasy": "Healthcare",
    "netmeds": "Healthcare", clinic: "Healthcare", doctor: "Healthcare",
    "lab test": "Healthcare", diagnostic: "Healthcare",
    "practo": "Healthcare", "apollo hospital": "Healthcare",

    // Shopping
    amazon: "Shopping", flipkart: "Shopping", myntra: "Shopping",
    ajio: "Shopping", meesho: "Shopping", snapdeal: "Shopping",
    nykaa: "Shopping", "tata cliq": "Shopping", croma: "Shopping",
    "reliance digital": "Shopping", "vijay sales": "Shopping",
    shopper: "Shopping",

    // EMI & Loans
    "loan emi": "EMI", "credit card bill": "EMI", emi: "EMI",
    "credit card": "EMI", "home loan": "EMI", "car loan": "EMI",
    "personal loan": "EMI", "education loan": "EMI",
    bajaj: "EMI", "bajaj finserv": "EMI",

    // Housing
    rent: "Housing", "house rent": "Housing", "room rent": "Housing",
    landlord: "Housing", "pg rent": "Housing", "hostel": "Housing",
    maintenance: "Housing", "society maintenance": "Housing",

    // Charity & Donations
    donation: "Charity", "temple donation": "Charity",
    ngo: "Charity", charity: "Charity", "pm cares": "Charity",
    "red cross": "Charity",

    // Investment
    investment: "Investment", "mutual fund": "Investment",
    "sip payment": "Investment", zerodha: "Investment",
    groww: "Investment", upstox: "Investment", "paytm money": "Investment",
    "coin by zerodha": "Investment", "kuvera": "Investment",
    "et money": "Investment", "fi money": "Investment",
    "stock purchase": "Investment", "fixed deposit": "Investment",
    "recurring deposit": "Investment", ppf: "Investment",

    // Education
    udemy: "Education", coursera: "Education", unacademy: "Education",
    byjus: "Education", "byju's": "Education", vedantu: "Education",
    school: "Education", college: "Education", university: "Education",
    "tuition fee": "Education", coaching: "Education",
    "exam fee": "Education",

    // Travel
    irctc: "Travel", "make my trip": "Travel", makemytrip: "Travel",
    "go ibibo": "Travel", goibibo: "Travel", cleartrip: "Travel",
    "ease my trip": "Travel", easemytrip: "Travel",
    "air india": "Travel", indigo: "Travel", "spice jet": "Travel",
    spicejet: "Travel", vistara: "Travel", hotel: "Travel",
    oyo: "Travel", "air asia": "Travel", flight: "Travel",
};

// ─── Category Keyword Lists (for fuzzy matching) ─────────────────────

const CATEGORY_KEYWORDS = {
    Food: ["food", "restaurant", "eat", "dine", "dining", "meal", "lunch", "dinner", "breakfast", "snack", "cafe", "coffee", "tea", "bakery", "kitchen", "biryani", "pizza", "burger", "chicken", "paneer"],
    Groceries: ["grocery", "vegetables", "fruits", "milk", "provisions", "kirana", "general store", "daily needs"],
    Transport: ["transport", "cab", "taxi", "auto", "rickshaw", "metro", "bus", "ride", "commute"],
    Fuel: ["petrol", "diesel", "fuel", "gas station", "filling station", "cng"],
    Utilities: ["electricity", "water", "gas", "internet", "broadband", "recharge", "prepaid", "postpaid", "dth"],
    Entertainment: ["movie", "cinema", "music", "streaming", "game", "concert", "show", "ticket", "park"],
    Healthcare: ["medical", "medicine", "health", "hospital", "clinic", "doctor", "pharmacy", "lab", "test", "dental"],
    Shopping: ["shopping", "purchase", "bought", "order", "delivery", "parcel", "electronics"],
    EMI: ["emi", "loan", "installment", "credit card", "repayment"],
    Housing: ["rent", "housing", "apartment", "flat", "maintenance", "society"],
    Charity: ["donation", "charity", "ngo", "temple", "church", "mosque", "gurudwara"],
    Investment: ["invest", "mutual fund", "sip", "stock", "share", "demat", "trading", "deposit", "ppf", "nps"],
    Education: ["education", "school", "college", "course", "tuition", "class", "exam", "fee", "book", "stationery"],
    Travel: ["travel", "flight", "hotel", "booking", "trip", "vacation", "holiday", "train", "railway"],
    Bills: ["bill", "invoice", "payment due", "outstanding"],
};

// ─── Income Detection Patterns ────────────────────────────────────────

const INCOME_KEYWORDS = [
    "salary", "wages", "payroll", "stipend",
    "cashback", "cash back", "reward",
    "refund", "returned", "reversal",
    "interest", "dividend",
    "freelance", "freelancing", "consulting",
    "client payment", "invoice payment",
    "bonus", "incentive", "commission",
    "rental income", "rent received",
    "received", "credited",
];

// ─── User Learning System ─────────────────────────────────────────────

const LEARNING_STORAGE_KEY = "merchant_category_map";

/**
 * Get user-learned merchant→category mappings from localStorage.
 */
const getUserMappings = () => {
    try {
        const stored = localStorage.getItem(LEARNING_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

/**
 * Save a user-corrected merchant→category mapping for future use.
 * @param {string} merchant - The merchant name.
 * @param {string} category - The corrected category.
 */
export const learnMerchantCategory = (merchant, category) => {
    if (!merchant || !category) return;
    const mappings = getUserMappings();
    const key = merchant.toLowerCase().trim();
    mappings[key] = category;
    localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(mappings));
};

/**
 * Get all learned mappings (for display or export).
 */
export const getLearnedMappings = () => getUserMappings();

/**
 * Clear all learned mappings.
 */
export const clearLearnedMappings = () => {
    localStorage.removeItem(LEARNING_STORAGE_KEY);
};

// ─── Main Classification Function ────────────────────────────────────

/**
 * Classify a transaction based on merchant name and additional context.
 * Priority: User Learned > Exact Merchant Match > Keyword Match > Fallback.
 *
 * @param {object} params
 * @param {string} params.merchant - Merchant/payee name.
 * @param {string} params.notes - Transaction notes/remarks.
 * @param {string} params.rawText - Full OCR text (optional, for deeper analysis).
 * @param {string} params.type - Pre-detected type ("income"/"expense").
 * @returns {{ category: string, confidence: number, source: string }}
 */
export const classifyTransaction = ({ merchant = "", notes = "", rawText = "", type = "expense" }) => {
    const merchantLower = merchant.toLowerCase().trim();
    const notesLower = notes.toLowerCase().trim();
    const contextText = `${merchantLower} ${notesLower} ${rawText.toLowerCase()}`;

    // ──── Priority 1: Check user-learned mappings ────
    const userMappings = getUserMappings();
    if (merchantLower && userMappings[merchantLower]) {
        return {
            category: userMappings[merchantLower],
            confidence: 97,
            source: "learned",
        };
    }

    // Also check partial matches in user mappings
    for (const [learnedMerchant, learnedCategory] of Object.entries(userMappings)) {
        if (merchantLower.includes(learnedMerchant) || learnedMerchant.includes(merchantLower)) {
            return {
                category: learnedCategory,
                confidence: 92,
                source: "learned_partial",
            };
        }
    }

    // ──── Priority 2: Exact merchant dictionary match ────
    if (merchantLower && MERCHANT_CATEGORY_MAP[merchantLower]) {
        return {
            category: MERCHANT_CATEGORY_MAP[merchantLower],
            confidence: 95,
            source: "dictionary",
        };
    }

    // Partial dictionary match (merchant name contains a known key)
    for (const [key, category] of Object.entries(MERCHANT_CATEGORY_MAP)) {
        if (merchantLower.includes(key) || key.includes(merchantLower)) {
            return {
                category,
                confidence: 88,
                source: "dictionary_partial",
            };
        }
    }

    // ──── Priority 3: Check if income-type keywords match ────
    if (type === "income") {
        // Income transactions with salary-like context
        for (const keyword of INCOME_KEYWORDS) {
            if (contextText.includes(keyword)) {
                if (["salary", "wages", "payroll", "stipend", "bonus", "incentive"].some(k => contextText.includes(k))) {
                    return { category: "Salary", confidence: 85, source: "keyword" };
                }
                if (["cashback", "reward"].some(k => contextText.includes(k))) {
                    return { category: "Shopping", confidence: 75, source: "keyword" };
                }
                if (["refund", "returned", "reversal"].some(k => contextText.includes(k))) {
                    return { category: "Shopping", confidence: 70, source: "keyword" };
                }
                if (["interest", "dividend"].some(k => contextText.includes(k))) {
                    return { category: "Investment", confidence: 80, source: "keyword" };
                }
                if (["freelance", "consulting", "client payment", "invoice payment"].some(k => contextText.includes(k))) {
                    return { category: "Salary", confidence: 80, source: "keyword" };
                }
            }
        }
        // Generic income
        return { category: "Received", confidence: 65, source: "type_default" };
    }

    // ──── Priority 4: Category keyword matching ────
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        for (const keyword of keywords) {
            if (contextText.includes(keyword)) {
                return {
                    category,
                    confidence: 78,
                    source: "keyword",
                };
            }
        }
    }

    // ──── Fallback ────
    return {
        category: "Others",
        confidence: 40,
        source: "fallback",
    };
};

/**
 * Determine if the overall scan should trigger a manual review.
 * @param {number} ocrConfidence - Tesseract.js confidence (0–100).
 * @param {number} classificationConfidence - Category match confidence.
 * @returns {boolean}
 */
export const shouldRequestReview = (ocrConfidence, classificationConfidence) => {
    return ocrConfidence < 85 || classificationConfidence < 70;
};
