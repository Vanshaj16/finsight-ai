import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isWorkspaceRoute = location.pathname !== "/login";

  if (loading) {
    return <LoadingSpinner label="Preparing FinSight AI" />;
  }

  return (
    <Suspense fallback={<LoadingSpinner label="Loading experience" />}>
      <>
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

        <p
          className={`pointer-events-none fixed inset-x-0 z-30 text-center text-xs font-medium text-white/42 ${
            isWorkspaceRoute ? "bottom-24 lg:bottom-4" : "bottom-4"
          }`}
        >
          © 2026 Vanshaj.co. All rights reserved.
        </p>
      </>
    </Suspense>
  );
};

export default App;
