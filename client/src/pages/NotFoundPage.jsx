import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="card-surface max-w-xl p-8 text-center text-white">
      <p className="kicker">404</p>
      <h1 className="hero-title mt-4 text-[4rem] text-white">Page not found</h1>
      <p className="mt-4 text-sm leading-8 text-white/58">
        The page you requested does not exist. Head back to the dashboard to continue managing your finances.
      </p>
      <Link to="/dashboard" className="primary-button mt-6 inline-flex">
        Back to dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
