import axios from "axios";
import env from "../config/env.js";

const aiClient = axios.create({
  baseURL: env.aiServiceUrl,
  timeout: 10000,
});

const fallbackError = (message) => ({
  unavailable: true,
  message,
});

export const categorizeDescription = async (description) => {
  try {
    const { data } = await aiClient.post("/categorize", { description });
    return data;
  } catch (_error) {
    return fallbackError("AI categorization is currently unavailable.");
  }
};

export const analyzeTransactions = async (payload) => {
  try {
    const { data } = await aiClient.post("/analyze", payload);
    return data;
  } catch (_error) {
    return fallbackError("AI analysis is currently unavailable.");
  }
};

export const askFinanceAssistant = async (payload) => {
  try {
    const { data } = await aiClient.post("/chat", payload);
    return data;
  } catch (_error) {
    return fallbackError("Chat assistant is currently unavailable.");
  }
};
