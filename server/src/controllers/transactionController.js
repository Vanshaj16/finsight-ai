import Transaction from "../models/Transaction.js";
import asyncHandler from "../utils/asyncHandler.js";
import httpError from "../utils/httpError.js";
import { categorizeDescription } from "../services/aiService.js";
import { notifyTransactionChange } from "../services/notificationService.js";

export const createTransaction = asyncHandler(async (req, res) => {
  const payload = { ...req.body };

  if (!payload.category || payload.category.toLowerCase() === "auto") {
    const categorization = await categorizeDescription(payload.description);
    payload.category = categorization.category || "Other";
  }

  const transaction = await Transaction.create({
    ...payload,
    userId: req.user._id,
  });

  await notifyTransactionChange({
    userId: req.user._id,
    action: "created",
    transaction,
  });

  res.status(201).json({ transaction });
});

export const getTransactions = asyncHandler(async (req, res) => {
  const { category, month, search } = req.query;
  const query = { userId: req.user._id };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.description = { $regex: search, $options: "i" };
  }

  if (month) {
    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    query.date = { $gte: start, $lt: end };
  }

  const transactions = await Transaction.find(query).sort({ date: -1, createdAt: -1 });
  res.status(200).json({ transactions });
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });

  if (!transaction) {
    throw httpError(404, "Transaction not found.");
  }

  Object.assign(transaction, req.body);

  if (!transaction.category || transaction.category.toLowerCase() === "auto") {
    const categorization = await categorizeDescription(transaction.description);
    transaction.category = categorization.category || "Other";
  }

  await transaction.save();
  await notifyTransactionChange({
    userId: req.user._id,
    action: "updated",
    transaction,
  });

  res.status(200).json({ transaction });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!transaction) {
    throw httpError(404, "Transaction not found.");
  }

  await notifyTransactionChange({
    userId: req.user._id,
    action: "deleted",
    transaction,
  });

  res.status(200).json({ message: "Transaction deleted." });
});
