import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "../utils/asyncHandler.js";
import { notifyBudgetChange, notifyBudgetExceededIfNeeded } from "../services/notificationService.js";

export const setBudget = asyncHandler(async (req, res) => {
  const { category, monthlyLimit } = req.body;

  const budget = await Budget.findOneAndUpdate(
    { userId: req.user._id, category },
    { monthlyLimit },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  await notifyBudgetChange({
    userId: req.user._id,
    category,
    monthlyLimit,
  });

  await notifyBudgetExceededIfNeeded({
    userId: req.user._id,
    category,
    date: new Date(),
  });

  res.status(200).json({ budget });
});

export const getBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ userId: req.user._id }).sort({ category: 1 });
  res.status(200).json({ budgets });
});

export const getBudgetSummary = asyncHandler(async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const transactionQuery = { userId: req.user._id };

  if (month !== "all") {
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    transactionQuery.date = { $gte: start, $lt: end };
  }

  const [budgets, transactions] = await Promise.all([
    Budget.find({ userId: req.user._id }).lean(),
    Transaction.find(transactionQuery).lean(),
  ]);

  const spendMap = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const summary = budgets.map((budget) => ({
    category: budget.category,
    monthlyLimit: budget.monthlyLimit,
    spent: Number((spendMap[budget.category] || 0).toFixed(2)),
    remaining: Number((budget.monthlyLimit - (spendMap[budget.category] || 0)).toFixed(2)),
    status: (spendMap[budget.category] || 0) > budget.monthlyLimit ? "over" : "within",
  }));

  res.status(200).json({ month, summary });
});
