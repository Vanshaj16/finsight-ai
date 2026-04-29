const StatCard = ({ label, value, accent, helper }) => (
  <article className="card-surface p-5 text-white transition duration-300 hover:-translate-y-1">
    <div className="mb-5 flex items-center justify-between">
      <p className="kicker">{label}</p>
      <span className={`h-3 w-3 rounded-full ${accent}`} />
    </div>
    <p className="text-3xl font-semibold tracking-tight text-white">{value}</p>
    <p className="mt-3 text-sm leading-6 text-white/55">{helper}</p>
  </article>
);

export default StatCard;
