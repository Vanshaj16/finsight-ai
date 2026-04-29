from collections import defaultdict
from datetime import datetime


class RecommendationEngine:
    def generate(self, transactions: list[dict], budgets: list[dict], analytics: dict) -> dict:
        if not transactions:
            return {
                "summary": "Start adding transactions to unlock tailored AI guidance.",
                "recommendations": [
                    "Add your regular bills, food, and travel expenses for a full monthly analysis.",
                    "Set category budgets so FinSight AI can flag overspending early.",
                ],
            }

        current_month = datetime.utcnow().strftime("%Y-%m")
        current_month_transactions = [
            transaction
            for transaction in transactions
            if datetime.fromisoformat(str(transaction["date"]).replace("Z", "+00:00")).strftime("%Y-%m") == current_month
        ]

        current_total = sum(float(transaction["amount"]) for transaction in current_month_transactions)
        category_totals = defaultdict(float)
        for transaction in current_month_transactions or transactions:
            category_totals[transaction["category"]] += float(transaction["amount"])

        top_category, top_value = max(category_totals.items(), key=lambda item: item[1])
        recommendations = []
        budget_map = {budget["category"]: float(budget["monthlyLimit"]) for budget in budgets}

        if top_category in budget_map and top_value > budget_map[top_category]:
            recommendations.append(
                f"{top_category} is above budget by Rs {round(top_value - budget_map[top_category], 2)} this cycle."
            )
        else:
            recommendations.append(
                f"{top_category} is your largest spending category right now. Reducing it by 10% could save about Rs {round(top_value * 0.1, 2)}."
            )

        subscription_total = category_totals.get("Subscriptions", 0)
        if subscription_total:
            recommendations.append(
                f"Review subscriptions worth Rs {round(subscription_total, 2)} to cut non-essential renewals."
            )

        savings_potential = analytics.get("savingsPotential", 0)
        if savings_potential:
            recommendations.append(
                f"You have an estimated savings opportunity of Rs {round(float(savings_potential), 2)} from over-budget categories."
            )

        while len(recommendations) < 3:
            recommendations.append(
                "Keep daily entries consistent so next-month predictions and anomaly detection become more precise."
            )

        summary = (
            f"This month you have tracked about Rs {round(current_total or analytics.get('totalSpending', 0), 2)} in spending. "
            f"Your highest category is {top_category} at roughly Rs {round(top_value, 2)}."
        )

        return {
            "summary": summary,
            "recommendations": recommendations[:3],
        }


recommender = RecommendationEngine()
