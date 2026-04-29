import { useDeferredValue, useEffect, useState } from "react";
import api from "../api/axios";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionTable from "../components/transactions/TransactionTable";

const currentMonth = new Date().toISOString().slice(0, 7);

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [month, setMonth] = useState(currentMonth);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const deferredSearch = useDeferredValue(search);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/transactions", {
        params: {
          month,
          search: deferredSearch || undefined,
        },
      });
      setTransactions(data.transactions);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [month, deferredSearch]);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      if (editing) {
        await api.put(`/transactions/${editing._id}`, payload);
      } else {
        await api.post("/transactions", payload);
      }
      window.dispatchEvent(new Event("notifications:refresh"));
      setEditing(null);
      await loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save transaction.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      window.dispatchEvent(new Event("notifications:refresh"));
      await loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete transaction.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="card-surface p-6 text-white lg:p-8">
        <p className="kicker">Money movement</p>
        <div className="mt-4 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end">
          <div>
            <h1 className="hero-title text-[4rem] text-white sm:text-[5rem]">Recent transactions</h1>
            <p className="mt-3 max-w-2xl text-base leading-8 text-white/56">
              Filter, edit, and auto-categorize expenses inside a cleaner transaction flow inspired by premium finance apps.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="field-label">Month</label>
              <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="field-input" />
            </div>
            <div>
              <label className="field-label">Search description</label>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="coffee, rent, petrol..."
                className="field-input"
              />
            </div>
          </div>
        </div>
      </section>

      <TransactionForm onSubmit={handleSubmit} transaction={editing} onCancel={() => setEditing(null)} submitting={saving} />

      {error ? <div className="card-surface p-4 text-sm text-[#ff9aaf]">{error}</div> : null}
      {loading ? <LoadingSpinner label="Loading transactions" /> : null}
      {!loading ? <TransactionTable transactions={transactions} onEdit={setEditing} onDelete={handleDelete} /> : null}
    </div>
  );
};

export default TransactionsPage;
