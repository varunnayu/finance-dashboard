/**
 * UPI OCR Engine — Orchestrates the full OCR pipeline.
 * Image → Preprocess → Tesseract.js OCR → Parsed Result.
 * Supports JPG, JPEG, PNG, WEBP natively; HEIC via heic2any conversion.
 */

import Tesseract from "tesseract.js";
import { parseUpiScreenshot } from "./upiParser";
import { classifyTransaction, shouldRequestReview } from "./aiClassifier";
import { maskUpiId } from "./dataMasker";

// ─── Supported Formats ───────────────────────────────────────────────
const SUPPORTED_FORMATS = [
    "image/jpeg", "image/jpg", "image/png",
    "image/webp", "image/heic", "image/heif",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const MIN_FILE_SIZE = 1024; // 1 KB (too small = invalid)

// ─── File Validation ─────────────────────────────────────────────────

/**
 * Validate the uploaded file before processing.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateFile = (file) => {
    if (!file) return { valid: false, error: "No file provided." };

    // Check file type
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isHeic = fileName.endsWith(".heic") || fileName.endsWith(".heif");
    
    if (!SUPPORTED_FORMATS.includes(fileType) && !isHeic) {
        return {
            valid: false,
            error: `Unsupported format. Supported: JPG, PNG, WEBP, HEIC.`,
        };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum: 20 MB.`,
        };
    }

    if (file.size < MIN_FILE_SIZE) {
        return {
            valid: false,
            error: "File too small. Please upload a valid screenshot.",
        };
    }

    return { valid: true };
};

// ─── HEIC Conversion ─────────────────────────────────────────────────

/**
 * Convert HEIC/HEIF file to JPEG for OCR processing.
 */
const convertHeicToJpeg = async (file) => {
    try {
        const heic2any = (await import("heic2any")).default;
        const blob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9,
        });
        return new File(
            [Array.isArray(blob) ? blob[0] : blob],
            file.name.replace(/\.heic$/i, ".jpg").replace(/\.heif$/i, ".jpg"),
            { type: "image/jpeg" }
        );
    } catch (error) {
        console.error("HEIC conversion failed:", error);
        throw new Error("Failed to convert HEIC image. Please convert to JPG or PNG first.");
    }
};

// ─── Image Preprocessing ─────────────────────────────────────────────

/**
 * Preprocess the image to improve OCR accuracy.
 * Enhances contrast and converts to grayscale for better text detection.
 * Works for both dark mode and light mode screenshots.
 */
const preprocessImage = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Scale down very large images for performance
            let width = img.width;
            let height = img.height;
            const maxDimension = 2000;

            if (width > maxDimension || height > maxDimension) {
                const scale = maxDimension / Math.max(width, height);
                width = Math.round(width * scale);
                height = Math.round(height * scale);
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Get image data for analysis
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;

            // Calculate average brightness to detect dark/light mode
            let totalBrightness = 0;
            const pixelCount = data.length / 4;
            for (let i = 0; i < data.length; i += 4) {
                totalBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
            }
            const avgBrightness = totalBrightness / pixelCount;
            const isDarkMode = avgBrightness < 128;

            // Apply contrast enhancement
            const contrast = isDarkMode ? 1.6 : 1.3;
            const midpoint = 128;

            for (let i = 0; i < data.length; i += 4) {
                // Convert to grayscale
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

                // Apply contrast
                let enhanced = midpoint + (gray - midpoint) * contrast;

                // For dark mode, invert colors for better OCR
                if (isDarkMode) {
                    enhanced = 255 - enhanced;
                }

                // Clamp
                enhanced = Math.max(0, Math.min(255, enhanced));

                data[i] = enhanced;
                data[i + 1] = enhanced;
                data[i + 2] = enhanced;
            }

            ctx.putImageData(imageData, 0, 0);

            canvas.toBlob((blob) => {
                resolve(blob || file);
            }, "image/png", 1.0);
        };

        img.onerror = () => resolve(file); // Fallback to original
        img.src = URL.createObjectURL(file);
    });
};

// ─── Main OCR Pipeline ───────────────────────────────────────────────

/**
 * Run the full OCR pipeline on a payment screenshot.
 *
 * @param {File} file - The image file to process.
 * @param {function} onProgress - Progress callback (0–100).
 * @returns {Promise<object>} Structured scan result.
 */
export const processScreenshot = async (file, onProgress = () => {}) => {
    const startTime = Date.now();

    // Step 1: Validate
    const validation = validateFile(file);
    if (!validation.valid) {
        throw new Error(validation.error);
    }

    // Step 2: Convert HEIC if needed
    let processableFile = file;
    const isHeic = file.name.toLowerCase().endsWith(".heic") || file.name.toLowerCase().endsWith(".heif");
    if (isHeic) {
        onProgress(5);
        processableFile = await convertHeicToJpeg(file);
    }

    // Step 3: Preprocess image for better OCR
    onProgress(10);
    const preprocessed = await preprocessImage(processableFile);

    // Step 4: Run Tesseract.js OCR
    onProgress(15);
    const ocrResult = await Tesseract.recognize(
        preprocessed,
        "eng",
        {
            logger: (m) => {
                if (m.status === "recognizing text") {
                    // Map Tesseract progress (0–1) to our range (15–80)
                    const progressValue = 15 + Math.round(m.progress * 65);
                    onProgress(Math.min(progressValue, 80));
                }
            },
        }
    );

    const rawText = ocrResult.data.text;
    const ocrConfidence = ocrResult.data.confidence || 0;

    // Step 5: Parse structured data from OCR text
    onProgress(85);
    const parsed = parseUpiScreenshot(rawText);

    // Step 6: AI Classification
    onProgress(90);
    const classification = classifyTransaction({
        merchant: parsed.merchant,
        notes: parsed.notes,
        rawText: rawText,
        type: parsed.type,
    });

    // Step 7: Determine if manual review is needed
    const needsReview = shouldRequestReview(ocrConfidence, classification.confidence);

    // Step 8: Build the final result
    onProgress(100);
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);

    return {
        // Extracted fields
        amount: parsed.amount,
        type: parsed.type,
        merchant: parsed.merchant,
        upiId: parsed.upiId,
        maskedUpiId: maskUpiId(parsed.upiId),
        refNumber: parsed.refNumber,
        date: parsed.date,
        time: parsed.time,
        paymentApp: parsed.paymentApp,
        bankName: parsed.bankName,
        notes: parsed.notes,

        // AI classification
        category: classification.category,
        categoryConfidence: classification.confidence,
        categorySource: classification.source,

        // Meta
        ocrConfidence: Math.round(ocrConfidence),
        overallConfidence: Math.round((ocrConfidence + classification.confidence) / 2),
        needsReview,
        processingTime,
        rawText,

        // Scan source marker
        scanSource: "upi_screenshot",
    };
};

/**
 * Get the confidence level label and color.
 */
export const getConfidenceLevel = (confidence) => {
    if (confidence >= 90) return { label: "High", color: "emerald" };
    if (confidence >= 75) return { label: "Medium", color: "amber" };
    if (confidence >= 50) return { label: "Low", color: "orange" };
    return { label: "Very Low", color: "red" };
};
