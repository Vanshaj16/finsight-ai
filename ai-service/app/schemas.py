from datetime import datetime
from typing import List
from pydantic import BaseModel, Field


class CategorizeRequest(BaseModel):
    description: str = Field(min_length=2, max_length=160)


class TransactionPayload(BaseModel):
    amount: float
    category: str
    description: str
    date: datetime
    paymentMethod: str


class BudgetPayload(BaseModel):
    category: str
    monthlyLimit: float


class PredictionRequest(BaseModel):
    transactions: List[TransactionPayload]


class RecommendationRequest(BaseModel):
    transactions: List[TransactionPayload]
    budgets: List[BudgetPayload] = []
    analytics: dict = {}


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=500)
    transactions: List[TransactionPayload]
    budgets: List[BudgetPayload] = []


class AnalyzeRequest(BaseModel):
    transactions: List[TransactionPayload]
    budgets: List[BudgetPayload] = []
    analytics: dict = {}
