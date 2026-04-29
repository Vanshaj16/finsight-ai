from collections import defaultdict
from datetime import datetime
from sklearn.linear_model import LinearRegression
import numpy as np


class SpendingPredictor:
    def predict_next_month(self, transactions: list[dict]) -> dict:
        month_totals = defaultdict(float)

        for transaction in transactions:
            key = datetime.fromisoformat(str(transaction["date"]).replace("Z", "+00:00")).strftime("%Y-%m")
            month_totals[key] += float(transaction["amount"])

        ordered = sorted(month_totals.items())

        if not ordered:
            return {"nextMonth": 0.0, "trend": "stable"}

        if len(ordered) == 1:
            return {"nextMonth": round(ordered[0][1], 2), "trend": "stable"}

        x = np.arange(len(ordered)).reshape(-1, 1)
        y = np.array([value for _, value in ordered])

        model = LinearRegression()
        model.fit(x, y)
        next_value = max(float(model.predict([[len(ordered)]])[0]), 0.0)
        trend = "upward" if next_value > y[-1] else "downward" if next_value < y[-1] else "stable"

        return {
            "nextMonth": round(next_value, 2),
            "trend": trend,
            "history": [{"month": month, "total": round(total, 2)} for month, total in ordered],
        }


predictor = SpendingPredictor()
