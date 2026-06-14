export const predictMonthlyExpense = (
    transactions
) => {
    const expenses = transactions.filter(
        (t) => t.type === "expense"
    );

    if (expenses.length === 0) {
        return {
            currentExpense: 0,
            predictedExpense: 0,
            trend: "No Data",
        };
    }

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyExpenses = expenses.filter(
        (transaction) => {
            const date = new Date(
                transaction.date
            );

            return (
                date.getMonth() === currentMonth &&
                date.getFullYear() === currentYear
            );
        }
    );

    const totalSpent = monthlyExpenses.reduce(
        (sum, transaction) =>
            sum + Number(transaction.amount),
        0
    );

    const currentDay =
        new Date().getDate();

    const daysInMonth =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();

    const predicted =
        currentDay > 0
            ? (
                totalSpent /
                currentDay
            ) *
            daysInMonth
            : totalSpent;

    let trend = "Stable";

    if (predicted > totalSpent * 1.4)
        trend = "High Spending";

    return {
        currentExpense: totalSpent,
        predictedExpense:
            predicted.toFixed(0),
        trend,
    };
};