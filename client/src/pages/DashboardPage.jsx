import { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import StatCard from "../components/ui/StatCard";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import MonthlyLineChart from "../components/charts/MonthlyLineChart";
import BudgetBarChart from "../components/charts/BudgetBarChart";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [transactionsResponse, budgetResponse, insightsResponse] = await Promise.all([
          api.get("/transactions"),
          api.get("/budgets/summary"),
          api.get("/insights"),
        ]);

        setData({
          transactions: transactionsResponse.data.transactions,
          budgets: budgetResponse.data.summary,
          insights: insightsResponse.data,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard" />;
  }

  if (error) {
    return <div className="card-surface p-5 text-sm text-[#ff9aaf]">{error}</div>;
  }

  const analytics = data.insights.analytics;
  const totalTransactions = data.transactions.length;
  const totalBudget = data.budgets.reduce((sum, item) => sum + item.monthlyLimit, 0);
  const remainingBudget = Math.max(totalBudget - data.budgets.reduce((sum, item) => sum + item.spent, 0), 0);
  const overBudgetCount = data.budgets.filter((item) => item.status === "over").length;
  const forecast = data.insights.prediction?.nextMonth || 0;
  const recentTransactions = data.transactions.slice(0, 4);
  const currentMonthKey = new Date().toISOString().slice(0, 7);
  const currentMonthCategoryMap = data.transactions.reduce((acc, transaction) => {
    const transactionMonth = new Date(transaction.date).toISOString().slice(0, 7);

    if (transactionMonth !== currentMonthKey) {
      return acc;
    }

    acc[transaction.category] = (acc[transaction.category] || 0) + Number(transaction.amount);
    return acc;
  }, {});
  const currentMonthCategoryBreakdown = Object.entries(currentMonthCategoryMap).map(([category, total]) => ({
    category,
    total: Number(total.toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      <section className="card-surface overflow-hidden p-6 text-white lg:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="kicker">Daily finance mode</p>
            <h1 className="hero-title mt-4 text-[4.3rem] text-white sm:text-[5.2rem]">Spend wisely every day</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-white/58">
              Your finances are now presented like a premium command center: clear momentum, visible limits, and AI actions that feel immediate.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="metric-chip">{totalTransactions} tracked entries</div>
              <div className="metric-chip">{data.insights.aiAvailable ? "AI service live" : "Fallback analysis mode"}</div>
              <div className="metric-chip">{overBudgetCount} category alerts</div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <StatCard
                label="Available To Spend"
                value={`Rs ${remainingBudget.toLocaleString("en-IN")}`}
                accent="bg-[#6EF4D8]"
                helper="Remaining room across your current monthly budget limits."
              />
              <StatCard
                label="Top Category"
                value={analytics.highestSpendingCategory.category}
                accent="bg-[#FF7A8A]"
                helper={`Rs ${analytics.highestSpendingCategory.total.toLocaleString("en-IN")}`}
              />
              <StatCard
                label="Forecast"
                value={`Rs ${Number(forecast).toLocaleString("en-IN")}`}
                accent="bg-[#8B7CFF]"
                helper="Projected next-month spending based on current history."
              />
            </div>
          </div>

          <div className="mx-auto w-full max-w-[390px] float-card">
            <div className="device-shell p-4 pt-10">
              <div className="rounded-[34px] bg-black px-5 pb-6 pt-5 text-white">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>FinSight Balance</span>
                  <span>{data.insights.aiAvailable ? "Live" : "Offline"}</span>
                </div>
                <div className="mx-auto mt-4 h-32 w-32 orb-ring" />
                <div className="mt-5 text-center">
                  <p className="text-5xl font-semibold text-white">Rs {remainingBudget.toLocaleString("en-IN")}</p>
                  <p className="mt-2 text-sm text-white/48">Available budget this month</p>
                </div>
              </div>

              <div className="ticket-surface mt-4 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7a8194]">Recent transactions</p>
                    <h3 className="mt-2 text-2xl font-semibold text-[#0A1020]">Smooth tracking</h3>
                  </div>
                  <div className="rounded-full bg-[#EEF2FF] px-4 py-2 text-xs font-semibold text-[#4250E8]">
                    {recentTransactions.length} latest
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {recentTransactions.map((item) => (
                    <div key={item._id} className="flex items-center justify-between rounded-[22px] bg-[#F5F7FB] px-4 py-3">
                      <div>
                        <p className="font-semibold text-[#0A1020]">{item.description}</p>
                        <p className="mt-1 text-sm text-[#646d82]">{item.category}</p>
                      </div>
                      <p className="font-semibold text-[#111827]">Rs {Number(item.amount).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <MonthlyLineChart data={analytics.monthlyTrend} />
        <CategoryPieChart data={currentMonthCategoryBreakdown} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <BudgetBarChart
          data={data.budgets.map((item) => ({
            category: item.category,
            limit: item.monthlyLimit,
            spent: item.spent,
          }))}
        />
        <article className="ticket-surface p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7b8397]">AI Summary</p>
          <h3 className="mt-3 text-3xl font-semibold text-[#090d18]">Financial pulse</h3>
          <p className="mt-4 text-sm leading-7 text-[#586075]">{data.insights.summary}</p>
          <div className="mt-6 space-y-3">
            {data.insights.recommendations.map((item) => (
              <div key={item} className="rounded-[22px] bg-[#F3F5FA] px-4 py-4 text-sm leading-6 text-[#111827]">
                {item}
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default DashboardPage;
