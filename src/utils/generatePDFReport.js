import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDFReport = ({
    income,
    expense,
    balance,
    transactions,
}) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.text("FinFlow Financial Report", 14, 20);

    doc.setFontSize(11);

    doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        14,
        30
    );

    // Summary
    doc.setFontSize(16);
    doc.text("Financial Summary", 14, 45);

    doc.setFontSize(12);

    doc.text(`Income: ₹${income}`, 14, 55);
    doc.text(`Expenses: ₹${expense}`, 14, 65);
    doc.text(`Balance: ₹${balance}`, 14, 75);

    const savingsRate =
        income > 0
            ? ((balance / income) * 100).toFixed(1)
            : 0;

    doc.text(
        `Savings Rate: ${savingsRate}%`,
        14,
        85
    );

    // Transactions Table
    autoTable(doc, {
        startY: 100,
        head: [
            [
                "Title",
                "Category",
                "Type",
                "Amount",
                "Date",
            ],
        ],
        body: transactions.map((t) => [
            t.title,
            t.category,
            t.type,
            `₹${t.amount}`,
            t.date,
        ]),
    });

    doc.save(
        `FinFlow_Report_${Date.now()}.pdf`
    );
};