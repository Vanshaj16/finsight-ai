import { useEffect, useState } from "react";
import api from "../api/axios";
import BudgetForm from "../components/budget/BudgetForm";
import BudgetBarChart from "../components/charts/BudgetBarChart";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const [budgetsResponse, summaryResponse] = await Promise.all([
        api.get("/budgets"),
        api.get("/budgets/summary"),
      ]);
      setBudgets(budgetsResponse.data.budgets);
      setSummary(summaryResponse.data.summary);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load budgets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      await api.post("/budgets", payload);
      window.dispatchEvent(new Event("notifications:refresh"));
      await loadBudgets();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save budget.");
    } finally {
      setSaving(false);
    }
  };

  const totalLimit = summary.reduce((sum, item) => sum + item.monthlyLimit, 0);
  const totalSpent = summary.reduce((sum, item) => sum + item.spent, 0);

  return (
    <div className="space-y-6">
      <section className="card-surface p-6 text-white lg:p-8">
        <p className="kicker">Budget rhythm</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="hero-title text-[4rem] text-white sm:text-[5rem]">Plan the month clearly</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-white/56">
              Set category limits and compare them against real spending in a cleaner, higher-contrast planning view.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="metric-chip">Budgeted Rs {totalLimit.toLocaleString("en-IN")}</div>
            <div className="metric-chip">Spent Rs {totalSpent.toLocaleString("en-IN")}</div>
          </div>
        </div>
      </section>

      <BudgetForm onSubmit={handleSubmit} submitting={saving} />
      {error ? <div className="card-surface p-4 text-sm text-[#ff9aaf]">{error}</div> : null}
      {loading ? <LoadingSpinner label="Loading budgets" /> : null}
      {!loading ? (
        <>
          <BudgetBarChart data={summary.map((item) => ({ category: item.category, limit: item.monthlyLimit, spent: item.spent }))} />
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="ticket-surface overflow-hidden">
              <div className="border-b border-[#EBEEF5] px-5 py-4">
                <h3 className="text-2xl font-semibold text-[#09101d]">Saved budgets</h3>
              </div>
              <div className="divide-y divide-[#EBEEF5]">
                {budgets.map((budget) => (
                  <div key={budget._id} className="flex items-center justify-between px-5 py-4 text-sm">
                    <span className="font-semibold text-[#09101d]">{budget.category}</span>
                    <span className="rounded-full bg-[#EEF2FF] px-4 py-2 text-[#3844d8]">Rs {Number(budget.monthlyLimit).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ticket-surface overflow-hidden">
              <div className="border-b border-[#EBEEF5] px-5 py-4">
                <h3 className="text-2xl font-semibold text-[#09101d]">Current month status</h3>
              </div>
              <div className="divide-y divide-[#EBEEF5]">
                {summary.map((item) => (
                  <div key={item.category} className="px-5 py-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#09101d]">{item.category}</span>
                      <span className={item.status === "over" ? "text-[#E75171]" : "text-[#0A9B73]"}>{item.status}</span>
                    </div>
                    <p className="mt-2 text-[#61697e]">
                      Spent Rs {item.spent.toLocaleString("en-IN")} of Rs {item.monthlyLimit.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default BudgetPage;
