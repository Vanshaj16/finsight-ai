const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex min-h-[220px] items-center justify-center">
    <div className="card-surface flex items-center gap-4 px-6 py-4 text-white">
      <div className="orb-ring h-12 w-12" />
      <div>
        <p className="kicker">FinSight AI</p>
        <p className="mt-2 text-sm font-medium text-white/72">{label}</p>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
