import Insight from "../models/Insight.js";
import asyncHandler from "../utils/asyncHandler.js";
import { analyzeTransactions } from "../services/aiService.js";
import { buildInsightPayload } from "../services/insightService.js";

export const getInsights = asyncHandler(async (req, res) => {
  const payload = await buildInsightPayload(req.user._id);
  const aiInsight = await analyzeTransactions(payload);

  const summary =
    aiInsight.summary ||
    `Your tracked spending is Rs ${payload.analytics.totalSpending.toLocaleString("en-IN")} with ${payload.analytics.highestSpendingCategory.category} as the largest category.`;

  const recommendations =
    aiInsight.recommendations ||
    ["Track recurring subscriptions and reduce the categories that exceed their limits."];

  await Insight.findOneAndUpdate(
    { userId: req.user._id },
    { summary, recommendations },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  res.status(200).json({
    summary,
    recommendations,
    prediction: aiInsight.prediction || null,
    analytics: payload.analytics,
    aiAvailable: !aiInsight.unavailable,
  });
});
