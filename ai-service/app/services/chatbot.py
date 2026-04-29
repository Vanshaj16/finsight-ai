import httpx
from app.core.settings import get_settings


class FinanceChatbot:
    async def respond(self, message: str, transactions: list[dict], budgets: list[dict]) -> str:
        settings = get_settings()

        if settings.gemini_api_key:
            response = await self._call_gemini(message, transactions, budgets, settings.gemini_api_key, settings.gemini_model)
            if response:
                return response

        return self._fallback_reply(message, transactions, budgets)

    async def _call_gemini(
        self,
        message: str,
        transactions: list[dict],
        budgets: list[dict],
        api_key: str,
        model: str,
    ) -> str | None:
        prompt = (
            "You are a concise personal finance assistant. Use the provided transactions and budgets to answer clearly, "
            "mention exact numbers when helpful, and never invent missing data.\n"
            f"User question: {message}\n"
            f"Transactions: {transactions[:50]}\n"
            f"Budgets: {budgets}\n"
        )

        async with httpx.AsyncClient(timeout=20.0) as client:
            try:
                response = await client.post(
                    f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                    params={"key": api_key},
                    headers={"Content-Type": "application/json"},
                    json={
                        "contents": [
                            {
                                "parts": [
                                    {
                                        "text": prompt,
                                    }
                                ]
                            }
                        ]
                    },
                )
                response.raise_for_status()
                payload = response.json()
            except Exception:
                return None

        for candidate in payload.get("candidates", []):
            content = candidate.get("content", {})
            for part in content.get("parts", []):
                text = part.get("text")
                if text:
                    return text.strip()

        return None

    def _fallback_reply(self, message: str, transactions: list[dict], budgets: list[dict]) -> str:
        total_spent = round(sum(float(transaction["amount"]) for transaction in transactions), 2)
        category_totals = {}
        for transaction in transactions:
            category = transaction["category"]
            category_totals[category] = round(category_totals.get(category, 0) + float(transaction["amount"]), 2)

        top_category = max(category_totals.items(), key=lambda item: item[1])[0] if category_totals else "N/A"
        top_total = category_totals.get(top_category, 0)
        budget_map = {budget["category"]: float(budget["monthlyLimit"]) for budget in budgets}

        lowered = message.lower()
        if "most" in lowered or "highest" in lowered:
            return f"Your highest spending category is {top_category} at Rs {top_total}."
        if "save" in lowered or "saving" in lowered:
            if top_category in budget_map and top_total > budget_map[top_category]:
                return (
                    f"Start with {top_category}. It is over budget by Rs {round(top_total - budget_map[top_category], 2)}. "
                    "Reducing that category first will have the fastest impact."
                )
            return f"Your biggest saving opportunity is {top_category}. Cutting it by 10% saves about Rs {round(top_total * 0.1, 2)}."

        return (
            f"You have tracked Rs {total_spent} overall. The largest category is {top_category} at Rs {top_total}. "
            "Ask about savings, category spikes, or monthly trends for a sharper recommendation."
        )


chatbot = FinanceChatbot()
