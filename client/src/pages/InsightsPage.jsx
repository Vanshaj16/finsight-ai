import { useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import MonthlyLineChart from "../components/charts/MonthlyLineChart";

const InsightsPage = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const { data } = await api.get("/insights");
        setInsights(data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load insights.");
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Generating insights" />;
  }

  if (error) {
    return <div className="card-surface p-5 text-sm text-[#ff9aaf]">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <section className="card-surface p-6 text-white lg:p-8">
        <p className="kicker">AI financial briefing</p>
        <div className="mt-4 grid gap-6 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div>
            <h1 className="hero-title text-[4rem] text-white sm:text-[5rem]">Sharper, calmer insight delivery</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-white/56">{insights.summary}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {insights.recommendations.map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-white/6 p-4 text-sm leading-7 text-white/82">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <MonthlyLineChart data={insights.analytics.monthlyTrend} />
        <CategoryPieChart data={insights.analytics.categoryBreakdown} />
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article className="ticket-surface p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7c8498]">Prediction</p>
          <h3 className="mt-3 text-2xl font-semibold text-[#09101d]">Next month estimate</h3>
          <p className="mt-5 text-4xl font-semibold text-[#3F4DE2]">Rs {Number(insights.prediction?.nextMonth || 0).toLocaleString("en-IN")}</p>
          <p className="mt-2 text-sm text-[#5f677b]">Trend: {insights.prediction?.trend || "stable"}</p>
        </article>
        <article className="ticket-surface p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7c8498]">Largest category</p>
          <h3 className="mt-3 text-2xl font-semibold text-[#09101d]">{insights.analytics.highestSpendingCategory.category}</h3>
          <p className="mt-5 text-4xl font-semibold text-[#111827]">Rs {Number(insights.analytics.highestSpendingCategory.total).toLocaleString("en-IN")}</p>
        </article>
        <article className="ticket-surface p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7c8498]">AI status</p>
          <h3 className="mt-3 text-2xl font-semibold text-[#09101d]">{insights.aiAvailable ? "Live analysis" : "Fallback mode"}</h3>
          <p className="mt-4 text-sm leading-7 text-[#61697e]">
            The interface stays useful even when the AI service is unavailable, then upgrades itself again when live analysis returns.
          </p>
        </article>
      </section>
    </div>
  );
};

export default InsightsPage;
