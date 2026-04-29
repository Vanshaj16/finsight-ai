const TransactionTable = ({ transactions, onEdit, onDelete }) => (
  <div className="space-y-4">
    {transactions.length === 0 ? (
      <div className="card-surface p-6 text-sm text-white/55">No transactions found.</div>
    ) : null}

    {transactions.map((transaction) => (
      <article
        key={transaction._id}
        className="ticket-surface flex flex-col gap-4 p-5 transition duration-300 hover:-translate-y-1 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0B0F1A] text-lg font-semibold text-white">
            {transaction.category?.[0] || "T"}
          </div>
          <div>
            <p className="text-base font-semibold text-[#090d17]">{transaction.description}</p>
            <p className="mt-1 text-sm text-[#51586b]">
              {transaction.category} · {transaction.paymentMethod}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-[#8a90a2]">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          <div className="rounded-full bg-[#EEF2FF] px-4 py-2 text-sm font-semibold text-[#3B45D9]">
            Rs {Number(transaction.amount).toLocaleString("en-IN")}
          </div>
          <button
            type="button"
            onClick={() => onEdit(transaction)}
            className="rounded-full border border-[#DDE2EC] px-4 py-2 text-sm font-semibold text-[#111725]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(transaction._id)}
            className="rounded-full bg-[#FFF0F3] px-4 py-2 text-sm font-semibold text-[#E75171]"
          >
            Delete
          </button>
        </div>
      </article>
    ))}
  </div>
);

export default TransactionTable;
