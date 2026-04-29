from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from app.models.training_samples import TRAINING_SAMPLES


class ExpenseCategorizer:
    def __init__(self) -> None:
        descriptions = [sample[0] for sample in TRAINING_SAMPLES]
        labels = [sample[1] for sample in TRAINING_SAMPLES]
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        matrix = self.vectorizer.fit_transform(descriptions)
        self.model = LogisticRegression(max_iter=1000)
        self.model.fit(matrix, labels)

    def predict(self, description: str) -> dict:
        features = self.vectorizer.transform([description])
        category = self.model.predict(features)[0]
        probabilities = self.model.predict_proba(features)[0]
        confidence = float(max(probabilities))
        return {
            "category": category,
            "confidence": round(confidence, 4),
        }


categorizer = ExpenseCategorizer()
