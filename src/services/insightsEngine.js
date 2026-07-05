/**
 * AI Insights Engine — Generates smart spending insights from transaction data.
 * Produces natural-language observations about spending patterns, trends, and anomalies.
 */

/**
 * Generate AI insights from transaction data.
 * @param {Array} transactions - All transactions from the finance context.
 * @returns {Array<{ text: string, type: string, icon: string, severity: string }>}
 */
export const generateInsights = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return [{
            text: "Start adding transactions to receive personalized AI insights about your spending patterns.",
            type: "info",
            icon: "💡",
            severity: "neutral",
        }];
    }

    const insights = [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // ── Separate by type ──
    const incomeTransactions = transactions.filter(t => t.type === "income");
    const expenseTransactions = transactions.filter(t => t.type === "expense");
    const totalIncome = sum(incomeTransactions);
    const totalExpense = sum(expenseTransactions);

    // ── Current month transactions ──
    const thisMonthTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    const thisMonthExpenses = thisMonthTx.filter(t => t.type === "expense");
    const thisMonthIncome = thisMonthTx.filter(t => t.type === "income");
    const thisMonthExpenseTotal = sum(thisMonthExpenses);
    const thisMonthIncomeTotal = sum(thisMonthIncome);

    // ── Last month transactions ──
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthTx = transactions.filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    });
    const lastMonthExpenses = lastMonthTx.filter(t => t.type === "expense");
    const lastMonthExpenseTotal = sum(lastMonthExpenses);

    // ── Category breakdown (this month) ──
    const categoryMap = {};
    thisMonthExpenses.forEach(t => {
        const cat = t.category || "Others";
        categoryMap[cat] = (categoryMap[cat] || 0) + Number(t.amount);
    });

    // Last month category breakdown
    const lastMonthCategoryMap = {};
    lastMonthExpenses.forEach(t => {
        const cat = t.category || "Others";
        lastMonthCategoryMap[cat] = (lastMonthCategoryMap[cat] || 0) + Number(t.amount);
    });

    // ── Top categories this month ──
    const sortedCategories = Object.entries(categoryMap)
        .sort(([, a], [, b]) => b - a);

    // ── Insight 1: Category spending this month ──
    if (sortedCategories.length > 0) {
        const [topCat, topAmount] = sortedCategories[0];
        insights.push({
            text: `You spent ₹${formatAmount(topAmount)} on ${topCat} this month.`,
            type: "spending",
            icon: "📊",
            severity: "neutral",
        });
    }

    // ── Insight 2: Category comparison vs last month ──
    for (const [cat, amount] of sortedCategories.slice(0, 3)) {
        const lastMonthAmount = lastMonthCategoryMap[cat] || 0;
        if (lastMonthAmount > 0) {
            const change = ((amount - lastMonthAmount) / lastMonthAmount) * 100;
            if (Math.abs(change) >= 15) {
                const direction = change > 0 ? "increased" : "decreased";
                const icon = change > 0 ? "📈" : "📉";
                const severity = change > 30 ? "warning" : change < -15 ? "success" : "neutral";
                insights.push({
                    text: `${cat} spending ${direction} by ${Math.abs(Math.round(change))}% compared to last month.`,
                    type: "trend",
                    icon,
                    severity,
                });
            }
        }
    }

    // ── Insight 3: Average expense comparison ──
    const monthCount = getUniqueMonthCount(expenseTransactions);
    if (monthCount >= 2) {
        const avgMonthlyExpense = totalExpense / monthCount;
        if (thisMonthExpenseTotal > avgMonthlyExpense * 1.2) {
            const percentAbove = Math.round(((thisMonthExpenseTotal - avgMonthlyExpense) / avgMonthlyExpense) * 100);
            insights.push({
                text: `This month's spending is ${percentAbove}% above your monthly average of ₹${formatAmount(avgMonthlyExpense)}.`,
                type: "warning",
                icon: "⚠️",
                severity: "warning",
            });
        } else if (thisMonthExpenseTotal < avgMonthlyExpense * 0.8) {
            const percentBelow = Math.round(((avgMonthlyExpense - thisMonthExpenseTotal) / avgMonthlyExpense) * 100);
            insights.push({
                text: `Great job! You're spending ${percentBelow}% below your monthly average this month.`,
                type: "success",
                icon: "🎉",
                severity: "success",
            });
        }
    }

    // ── Insight 4: Income detection ──
    if (thisMonthIncomeTotal > 0) {
        const salaryTx = thisMonthIncome.find(t =>
            (t.title || t.merchant || "").toLowerCase().includes("salary") ||
            (t.category || "").toLowerCase() === "salary"
        );
        if (salaryTx) {
            const salaryDate = new Date(salaryTx.date);
            const dayOfMonth = salaryDate.getDate();
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            insights.push({
                text: `You received salary on ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)} ${monthNames[salaryDate.getMonth()]}.`,
                type: "income",
                icon: "💰",
                severity: "success",
            });
        }
    }

    // ── Insight 5: Top merchant ──
    const merchantMap = {};
    thisMonthExpenses.forEach(t => {
        const merchant = t.title || t.merchant || "Unknown";
        merchantMap[merchant] = (merchantMap[merchant] || 0) + Number(t.amount);
    });
    const sortedMerchants = Object.entries(merchantMap).sort(([, a], [, b]) => b - a);
    if (sortedMerchants.length > 0) {
        const [topMerchant, topMerchantAmount] = sortedMerchants[0];
        insights.push({
            text: `Your top spending destination is ${topMerchant} with ₹${formatAmount(topMerchantAmount)} this month.`,
            type: "merchant",
            icon: "🏪",
            severity: "neutral",
        });
    }

    // ── Insight 6: Savings rate ──
    if (thisMonthIncomeTotal > 0 && thisMonthExpenseTotal > 0) {
        const savingsRate = ((thisMonthIncomeTotal - thisMonthExpenseTotal) / thisMonthIncomeTotal) * 100;
        if (savingsRate >= 30) {
            insights.push({
                text: `Excellent! Your savings rate this month is ${Math.round(savingsRate)}%. You're building great financial habits.`,
                type: "success",
                icon: "🏆",
                severity: "success",
            });
        } else if (savingsRate < 10 && savingsRate >= 0) {
            insights.push({
                text: `Your savings rate is only ${Math.round(savingsRate)}% this month. Consider reducing non-essential expenses.`,
                type: "warning",
                icon: "💭",
                severity: "warning",
            });
        } else if (savingsRate < 0) {
            insights.push({
                text: `You're spending more than you earn this month. Expenses exceed income by ₹${formatAmount(Math.abs(thisMonthIncomeTotal - thisMonthExpenseTotal))}.`,
                type: "danger",
                icon: "🚨",
                severity: "danger",
            });
        }
    }

    // ── Insight 7: Suggest reducing high categories ──
    if (sortedCategories.length >= 2) {
        const entertainmentSpend = categoryMap["Entertainment"] || 0;
        const foodSpend = categoryMap["Food"] || 0;
        const shoppingSpend = categoryMap["Shopping"] || 0;

        if (entertainmentSpend > thisMonthExpenseTotal * 0.15) {
            insights.push({
                text: `Entertainment accounts for ${Math.round((entertainmentSpend / thisMonthExpenseTotal) * 100)}% of your expenses. Consider setting a budget.`,
                type: "suggestion",
                icon: "💡",
                severity: "neutral",
            });
        }
        if (foodSpend > thisMonthExpenseTotal * 0.30) {
            insights.push({
                text: `Food & dining makes up ${Math.round((foodSpend / thisMonthExpenseTotal) * 100)}% of spending. Cooking at home could help save more.`,
                type: "suggestion",
                icon: "🍳",
                severity: "neutral",
            });
        }
        if (shoppingSpend > thisMonthExpenseTotal * 0.25) {
            insights.push({
                text: `Shopping is ${Math.round((shoppingSpend / thisMonthExpenseTotal) * 100)}% of your expenses this month. Consider a cooling-off period before purchases.`,
                type: "suggestion",
                icon: "🛍️",
                severity: "neutral",
            });
        }
    }

    // ── Insight 8: Transaction frequency ──
    if (thisMonthExpenses.length > 0) {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysPassed = Math.min(now.getDate(), daysInMonth);
        const avgDaily = thisMonthExpenses.length / daysPassed;
        if (avgDaily >= 3) {
            insights.push({
                text: `You're averaging ${avgDaily.toFixed(1)} transactions per day this month. That's quite active!`,
                type: "info",
                icon: "📱",
                severity: "neutral",
            });
        }
    }

    // Limit to 6 most relevant insights
    return insights.slice(0, 6);
};

// ─── Helper Functions ─────────────────────────────────────────────────

const sum = (transactions) =>
    transactions.reduce((acc, t) => acc + Number(t.amount || 0), 0);

const formatAmount = (amount) =>
    Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
};

const getUniqueMonthCount = (transactions) => {
    const months = new Set();
    transactions.forEach(t => {
        const d = new Date(t.date);
        if (!isNaN(d.getTime())) {
            months.add(`${d.getFullYear()}-${d.getMonth()}`);
        }
    });
    return months.size;
};
