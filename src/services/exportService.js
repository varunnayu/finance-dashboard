/**
 * Export Service — CSV, Excel, and enhanced PDF export.
 * Exports transaction data in multiple formats with all UPI-specific fields.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// ─── CSV Export ──────────────────────────────────────────────────────

/**
 * Export transactions as a CSV file.
 * @param {Array} transactions
 * @param {string} filename
 */
export const exportCSV = (transactions, filename = "FinFlow_Transactions") => {
    const headers = [
        "Title", "Amount", "Category", "Type", "Date", "Time",
        "Merchant", "Payment App", "UPI Reference", "Bank", "Notes"
    ];

    const rows = transactions.map(t => [
        escapeCsv(t.title || ""),
        t.amount || 0,
        t.category || "",
        t.type || "",
        t.date || "",
        t.time || "",
        t.merchant || t.title || "",
        t.paymentApp || "",
        t.refNumber || "",
        t.bankName || "",
        escapeCsv(t.notes || ""),
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map(r => r.join(","))
    ].join("\n");

    downloadFile(
        `${filename}_${getDateStamp()}.csv`,
        csvContent,
        "text/csv;charset=utf-8;"
    );
};

/**
 * Escape a CSV field value (handle commas, quotes, newlines).
 */
const escapeCsv = (value) => {
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

// ─── Excel Export ────────────────────────────────────────────────────

/**
 * Export transactions as an Excel (.xlsx) file.
 * Creates two sheets: Summary + Transactions.
 * @param {Array} transactions
 * @param {{ income: number, expense: number, balance: number }} summary
 * @param {string} filename
 */
export const exportExcel = (transactions, summary = {}, filename = "FinFlow_Report") => {
    const wb = XLSX.utils.book_new();

    // ── Sheet 1: Summary ──
    const summaryData = [
        ["FinFlow Financial Report"],
        [`Generated: ${new Date().toLocaleDateString("en-IN")}`],
        [],
        ["Metric", "Value"],
        ["Total Income", `₹${Number(summary.income || 0).toLocaleString("en-IN")}`],
        ["Total Expenses", `₹${Number(summary.expense || 0).toLocaleString("en-IN")}`],
        ["Net Balance", `₹${Number(summary.balance || 0).toLocaleString("en-IN")}`],
        ["Total Transactions", transactions.length],
        ["Savings Rate", summary.income > 0 ? `${(((summary.income - summary.expense) / summary.income) * 100).toFixed(1)}%` : "0%"],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

    // ── Sheet 2: Transactions ──
    const txHeaders = [
        "Title", "Amount (₹)", "Category", "Type", "Date", "Time",
        "Merchant", "Payment App", "UPI Reference", "Bank", "Notes"
    ];
    const txRows = transactions.map(t => [
        t.title || "",
        Number(t.amount) || 0,
        t.category || "",
        t.type || "",
        t.date || "",
        t.time || "",
        t.merchant || t.title || "",
        t.paymentApp || "",
        t.refNumber || "",
        t.bankName || "",
        t.notes || "",
    ]);

    const txData = [txHeaders, ...txRows];
    const txSheet = XLSX.utils.aoa_to_sheet(txData);

    // Auto-width columns
    const colWidths = txHeaders.map((h, i) => {
        const maxLen = Math.max(
            h.length,
            ...txRows.map(r => String(r[i]).length)
        );
        return { wch: Math.min(maxLen + 2, 40) };
    });
    txSheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, txSheet, "Transactions");

    // Write and download
    XLSX.writeFile(wb, `${filename}_${getDateStamp()}.xlsx`);
};

// ─── Enhanced PDF Export ─────────────────────────────────────────────

/**
 * Export transactions as a PDF report with enhanced fields.
 * @param {Array} transactions
 * @param {{ income: number, expense: number, balance: number }} summary
 * @param {string} filename
 */
export const exportPDF = (transactions, summary = {}, filename = "FinFlow_Report") => {
    const doc = new jsPDF();
    const income = summary.income || 0;
    const expense = summary.expense || 0;
    const balance = summary.balance || 0;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(99, 102, 241); // Brand indigo
    doc.text("FinFlow Financial Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}`, 14, 28);

    // Summary section
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text("Financial Summary", 14, 42);

    doc.setFontSize(11);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text(`Income: ₹${income.toLocaleString("en-IN")}`, 14, 52);

    doc.setTextColor(244, 63, 94); // Rose
    doc.text(`Expenses: ₹${expense.toLocaleString("en-IN")}`, 14, 60);

    doc.setTextColor(30, 41, 59);
    doc.text(`Balance: ₹${balance.toLocaleString("en-IN")}`, 14, 68);

    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : "0.0";
    doc.text(`Savings Rate: ${savingsRate}%`, 14, 76);
    doc.text(`Total Transactions: ${transactions.length}`, 14, 84);

    // Transactions Table with enhanced columns
    autoTable(doc, {
        startY: 95,
        head: [["Title", "Amount", "Category", "Type", "Date", "Payment App"]],
        body: transactions.map(t => [
            (t.title || "").slice(0, 25),
            `₹${Number(t.amount || 0).toLocaleString("en-IN")}`,
            t.category || "",
            t.type || "",
            t.date || "",
            t.paymentApp || "-",
        ]),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: {
            fillColor: [99, 102, 241], // Brand indigo
            textColor: 255,
            fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`${filename}_${getDateStamp()}.pdf`);
};

// ─── Utility ─────────────────────────────────────────────────────────

const getDateStamp = () => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
};

const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
