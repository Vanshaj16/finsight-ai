import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";
import asyncHandler from "../utils/asyncHandler.js";
import { askFinanceAssistant } from "../services/aiService.js";

export const chatWithAssistant = asyncHandler(async (req, res) => {
  const { message } = req.body;

  const [transactions, budgets] = await Promise.all([
    Transaction.find({ userId: req.user._id }).sort({ date: -1 }).limit(100).lean(),
    Budget.find({ userId: req.user._id }).lean(),
  ]);

  const response = await askFinanceAssistant({
    message,
    transactions,
    budgets,
  });

  res.status(200).json({
    reply:
      response.reply ||
      "I could not reach the AI model, but your spending data is loaded and ready once the service is available.",
    aiAvailable: !response.unavailable,
  });
});
