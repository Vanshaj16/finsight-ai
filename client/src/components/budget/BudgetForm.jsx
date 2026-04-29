import { useState } from "react";

const categories = [
  "Food",
  "Travel",
  "Bills",
  "Groceries",
  "Subscriptions",
  "Entertainment",
  "Healthcare",
  "Shopping",
  "Education",
  "Housing",
  "Other",
];

const BudgetForm = ({ onSubmit, submitting }) => {
  const [category, setCategory] = useState("Food");
  const [monthlyLimit, setMonthlyLimit] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ category, monthlyLimit: Number(monthlyLimit) });
    setMonthlyLimit("");
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface grid gap-4 p-6 text-white md:grid-cols-[1fr_1fr_auto]">
      <div>
        <label className="field-label">Category</label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="field-input">
          {categories.map((item) => (
            <option key={item} value={item} className="bg-[#090b12] text-white">
              {item}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">Monthly Limit</label>
        <input
          required
          type="number"
          min="0"
          step="0.01"
          value={monthlyLimit}
          onChange={(event) => setMonthlyLimit(event.target.value)}
          className="field-input"
          placeholder="12000"
        />
      </div>
      <div className="flex items-end">
        <button type="submit" disabled={submitting} className="primary-button w-full disabled:opacity-70">
          {submitting ? "Saving..." : "Set budget"}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
