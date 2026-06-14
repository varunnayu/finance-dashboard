export const calculateFinancialHealth = (
    transactions,
    goals = []
) => {
    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const savings = income - expense;

    const savingsRate =
        income > 0
            ? (savings / income) * 100
            : 0;

    const expenseRatio =
        income > 0
            ? (expense / income) * 100
            : 0;

    let score = 0;

    if (income > expense) score += 40;

    if (savingsRate >= 20) score += 20;

    if (expenseRatio <= 80) score += 20;

    if (goals.length > 0) score += 10;

    if (transactions.length > 0) score += 10;

    let status = "Needs Improvement";

    if (score >= 80) status = "Excellent";
    else if (score >= 60) status = "Good";
    else if (score >= 40) status = "Fair";

    return {
        score,
        status,
        income,
        expense,
        savings,
        savingsRate,
        expenseRatio,
    };
};