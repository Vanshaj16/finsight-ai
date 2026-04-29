import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import useAuth from "./hooks/useAuth";
import ProtectedRoute from "./routes/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const TransactionsPage = lazy(() => import("./pages/TransactionsPage"));
const BudgetPage = lazy(() => import("./pages/BudgetPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage"));
const ChatbotPage = lazy(() => import("./pages/ChatbotPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner label="Preparing FinSight AI" />;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Loading experience" />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default App;
