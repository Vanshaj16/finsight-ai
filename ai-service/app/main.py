from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import AnalyzeRequest, CategorizeRequest, ChatRequest, PredictionRequest, RecommendationRequest
from app.services.categorizer import categorizer
from app.services.predictor import predictor
from app.services.recommender import recommender
from app.services.chatbot import chatbot

app = FastAPI(title="FinSight AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict:
    return {"status": "ok", "service": "ai-service"}


@app.post("/categorize")
async def categorize_expense(payload: CategorizeRequest) -> dict:
    return categorizer.predict(payload.description)


@app.post("/predict")
async def predict_spending(payload: PredictionRequest) -> dict:
    transactions = [transaction.model_dump() for transaction in payload.transactions]
    return predictor.predict_next_month(transactions)


@app.post("/recommend")
async def recommend_actions(payload: RecommendationRequest) -> dict:
    transactions = [transaction.model_dump() for transaction in payload.transactions]
    budgets = [budget.model_dump() for budget in payload.budgets]
    return recommender.generate(transactions, budgets, payload.analytics)


@app.post("/chat")
async def finance_chat(payload: ChatRequest) -> dict:
    transactions = [transaction.model_dump() for transaction in payload.transactions]
    budgets = [budget.model_dump() for budget in payload.budgets]
    reply = await chatbot.respond(payload.message, transactions, budgets)
    return {"reply": reply}


@app.post("/analyze")
async def analyze_finances(payload: AnalyzeRequest) -> dict:
    transactions = [transaction.model_dump() for transaction in payload.transactions]
    budgets = [budget.model_dump() for budget in payload.budgets]
    prediction = predictor.predict_next_month(transactions)
    recommendations = recommender.generate(transactions, budgets, payload.analytics)
    return {
        "summary": recommendations["summary"],
        "recommendations": recommendations["recommendations"],
        "prediction": prediction,
    }
