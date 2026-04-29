import { useEffect, useState } from "react";

const defaultForm = {
  amount: "",
  category: "Auto",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: "UPI",
};

const categories = [
  "Auto",
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

const methods = ["UPI", "Card", "Cash", "Bank Transfer", "Wallet"];

const TransactionForm = ({ onSubmit, transaction, onCancel, submitting }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (transaction) {
      setForm({
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: String(transaction.date).slice(0, 10),
        paymentMethod: transaction.paymentMethod,
      });
      return;
    }

    setForm(defaultForm);
  }, [transaction]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
      category: form.category === "Auto" ? "auto" : form.category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface grid gap-5 p-6 text-white lg:grid-cols-2 xl:grid-cols-5">
      <div>
        <label className="field-label">Amount</label>
        <input
          required
          type="number"
          min="0"
          step="0.01"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="field-input"
          placeholder="2500"
        />
      </div>
      <div>
        <label className="field-label">Category</label>
        <select name="category" value={form.category} onChange={handleChange} className="field-input">
          {categories.map((category) => (
            <option key={category} value={category} className="bg-[#090b12] text-white">
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label">Description</label>
        <input
          required
          name="description"
          value={form.description}
          onChange={handleChange}
          className="field-input"
          placeholder="Dinner with friends"
        />
      </div>
      <div>
        <label className="field-label">Date</label>
        <input required type="date" name="date" value={form.date} onChange={handleChange} className="field-input" />
      </div>
      <div>
        <label className="field-label">Payment</label>
        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="field-input">
          {methods.map((method) => (
            <option key={method} value={method} className="bg-[#090b12] text-white">
              {method}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-3 lg:col-span-2 xl:col-span-5">
        <button type="submit" disabled={submitting} className="primary-button disabled:opacity-70">
          {submitting ? "Saving..." : transaction ? "Update transaction" : "Add transaction"}
        </button>
        {transaction ? (
          <button type="button" onClick={onCancel} className="secondary-button">
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default TransactionForm;
