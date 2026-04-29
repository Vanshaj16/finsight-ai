import Budget from "../models/Budget.js";
import Notification from "../models/Notification.js";
import Transaction from "../models/Transaction.js";

const formatCurrency = (value) => `Rs ${Number(value).toLocaleString("en-IN")}`;

const formatMonthLabel = (date) =>
  new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);

export const createNotification = async ({ userId, type, title, message, metadata = {} }) =>
  Notification.create({
    userId,
    type,
    title,
    message,
    metadata,
  });

export const notifyTransactionChange = async ({ userId, action, transaction }) => {
  const actionText = {
    created: "added",
    updated: "updated",
    deleted: "deleted",
  }[action] || "updated";

  await createNotification({
    userId,
    type: `transaction_${action}`,
    title: `Transaction ${actionText}`,
    message: `${transaction.description} was ${actionText} for ${formatCurrency(transaction.amount)} in ${transaction.category}.`,
    metadata: {
      transactionId: transaction._id,
      category: transaction.category,
    },
  });

  await notifyBudgetExceededIfNeeded({
    userId,
    category: transaction.category,
    date: transaction.date,
  });
};

export const notifyBudgetChange = async ({ userId, category, monthlyLimit }) => {
  await createNotification({
    userId,
    type: "budget_updated",
    title: "Budget updated",
    message: `${category} monthly budget is now set to ${formatCurrency(monthlyLimit)}.`,
    metadata: {
      category,
      monthlyLimit,
    },
  });
};

export const notifyProfileUpdated = async ({ userId, name }) => {
  await createNotification({
    userId,
    type: "profile_updated",
    title: "Profile updated",
    message: `${name || "Your account"} profile details were updated successfully.`,
  });
};

export const notifyBudgetExceededIfNeeded = async ({ userId, category, date }) => {
  if (!category || !date) {
    return;
  }

  const monthDate = new Date(date);
  const monthKey = monthDate.toISOString().slice(0, 7);
  const monthStart = new Date(`${monthKey}-01T00:00:00.000Z`);
  const monthEnd = new Date(monthStart);
  monthEnd.setMonth(monthEnd.getMonth() + 1);

  const [budget, transactions] = await Promise.all([
    Budget.findOne({ userId, category }).lean(),
    Transaction.find({ userId, category, date: { $gte: monthStart, $lt: monthEnd } }).lean(),
  ]);

  if (!budget) {
    return;
  }

  const spent = transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  if (spent <= budget.monthlyLimit) {
    return;
  }

  await Notification.findOneAndUpdate(
    {
      userId,
      type: "budget_exceeded",
      "metadata.category": category,
      "metadata.month": monthKey,
    },
    {
      title: "Budget limit exceeded",
      message: `${category} spending reached ${formatCurrency(spent)}, above your ${formatCurrency(budget.monthlyLimit)} limit for ${formatMonthLabel(monthDate)}.`,
      isRead: false,
      metadata: {
        category,
        month: monthKey,
        spent,
        monthlyLimit: budget.monthlyLimit,
      },
      userId,
      type: "budget_exceeded",
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );
};
