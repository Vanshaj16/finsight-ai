# FinSight AI

FinSight AI is a full-stack personal finance platform built with the MERN stack and a FastAPI AI microservice. It helps users track expenses, compare spending against budgets, surface AI-generated insights, and chat with a finance assistant using their live transaction context.

## Architecture

- `client/` React + Vite + Tailwind CSS dashboard
- `server/` Express.js REST API with MongoDB and JWT auth
- `ai-service/` FastAPI service for categorization, predictions, recommendations, and chat reasoning

## Features

- Email/password auth with bcrypt + JWT cookies
- Google OAuth 2.0 login with Passport
- CRUD transactions and monthly budgets
- Dashboard analytics, charts, and budget tracking
- AI categorization, next-month spend prediction, and recommendations
- Context-aware chat assistant
- Input validation, rate limiting, secure cookies, CORS, and centralized error handling

## Quick Start

### 1. Install dependencies

```bash
npm install
npm install --workspace client
npm install --workspace server
python -m venv .venv
.venv\Scripts\activate
pip install -r ai-service/requirements.txt
```

### 2. Configure environment variables

Copy the included templates:

- `server/.env.example` -> `server/.env`
- `client/.env.example` -> `client/.env`
- `ai-service/.env.example` -> `ai-service/.env`

The root `.env.example` also contains a combined reference for the whole stack.

### 3. Start services

Backend:

```bash
npm run dev:server
```

Frontend:

```bash
npm run dev:client
```

AI service:

```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Optional Google OAuth setup

Create a Google OAuth web application and configure:

- Authorized JavaScript origin: `http://localhost:5173`
- Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`

## Production Notes

- Use HTTPS and set `NODE_ENV=production`
- Set secure secrets for JWT/session cookies
- Restrict CORS to trusted domains
- Use a managed MongoDB instance
- Replace the fallback rule-based chat path by supplying `GEMINI_API_KEY`

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/auth/google`
- `GET /api/auth/google/callback`

### Transactions

- `POST /api/transactions`
- `GET /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

### Budget

- `POST /api/budgets`
- `GET /api/budgets`
- `GET /api/budgets/summary`

### Insights

- `GET /api/insights`

### Chat

- `POST /api/chat`

## AI Service Endpoints

- `POST /categorize`
- `POST /predict`
- `POST /recommend`
- `POST /chat`
- `POST /analyze`
