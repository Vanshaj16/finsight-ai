import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";

const formatMonthKey = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);

export const buildInsightPayload = async (userId) => {
  const transactions = await Transaction.find({ userId }).sort({ date: 1 }).lean();
  const budgets = await Budget.find({ userId }).lean();

  const totalSpending = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const categoryMap = transactions.reduce((acc, transaction) => {
    const key = transaction.category;
    acc[key] = (acc[key] || 0) + transaction.amount;
    return acc;
  }, {});

  const highestSpendingCategoryEntry =
    Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || ["No transactions", 0];

  const monthlyMap = transactions.reduce((acc, transaction) => {
    const key = formatMonthKey(new Date(transaction.date));
    acc[key] = (acc[key] || 0) + transaction.amount;
    return acc;
  }, {});

  const monthlyTrend = Object.entries(monthlyMap).map(([month, total]) => ({
    month,
    total: Number(total.toFixed(2)),
  }));

  const categoryBreakdown = Object.entries(categoryMap).map(([category, total]) => ({
    category,
    total: Number(total.toFixed(2)),
  }));

  const budgetMap = budgets.reduce((acc, budget) => {
    acc[budget.category] = budget.monthlyLimit;
    return acc;
  }, {});

  const budgetComparison = categoryBreakdown.map((item) => ({
    category: item.category,
    spent: item.total,
    limit: budgetMap[item.category] || 0,
    variance: Number((item.total - (budgetMap[item.category] || 0)).toFixed(2)),
  }));

  const savingsPotential = budgetComparison
    .filter((item) => item.limit > 0 && item.spent > item.limit)
    .reduce((sum, item) => sum + (item.spent - item.limit), 0);

  return {
    transactions,
    budgets,
    analytics: {
      totalSpending: Number(totalSpending.toFixed(2)),
      highestSpendingCategory: {
        category: highestSpendingCategoryEntry[0],
        total: Number(highestSpendingCategoryEntry[1].toFixed(2)),
      },
      savingsPotential: Number(savingsPotential.toFixed(2)),
      monthlyTrend,
      categoryBreakdown,
      budgetComparison,
    },
  };
};
