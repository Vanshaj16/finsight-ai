import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import useAuth from "../hooks/useAuth";

const initialState = { name: "", email: "", password: "" };

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const googleEnabled = import.meta.env.VITE_GOOGLE_OAUTH_ENABLED === "true";
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login({ email: form.email, password: form.password });
      } else {
        await register(form);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to authenticate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="card-surface relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-x-0 bottom-[-18%] h-[44%] rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="kicker">Way → Every Day</div>
              <h1 className="hero-title mt-5 max-w-2xl text-[4.3rem] text-white sm:text-[5.8rem] lg:text-[7rem]">
                Spend wisely & effortlessly
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-white/62 md:text-lg">
                FinSight AI turns your transaction stream into a premium daily finance ritual with AI-led insights, budgets, and assistant guidance.
              </p>
            </div>

            <div className="mt-10 grid items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-4">
                <div className="metric-chip inline-flex items-center gap-3">
                  <Sparkles size={16} />
                  AI categorization and forecasting
                </div>
                <div className="metric-chip inline-flex items-center gap-3">
                  <ShieldCheck size={16} />
                  Secure JWT and Google OAuth flows
                </div>
                <div className="metric-chip inline-flex items-center gap-3">
                  <ArrowRight size={16} />
                  Smooth budgeting and chat assistance
                </div>
              </div>

              <div className="float-card mx-auto w-full max-w-[370px]">
                <div className="device-shell p-4 pt-10">
                  <div className="rounded-[34px] bg-black px-5 pb-5 pt-6 text-center text-white">
                    <div className="mx-auto h-48 w-48 orb-ring" />
                    <div className="mt-6">
                      <p className="hero-title text-5xl text-white">Spend wisely</p>
                      <p className="hero-title -mt-1 text-5xl text-white/94">& effortlessly</p>
                    </div>
                  </div>
                  <div className="ticket-surface mt-4 px-5 py-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7b8295]">FinSight onboarding</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-xl font-semibold text-[#0B1020]">Premium finance flow</p>
                        <p className="mt-1 text-sm text-[#656d82]">Enter, analyze, improve.</p>
                      </div>
                      <button className="rounded-full bg-[#5C63FF] px-4 py-2 text-sm font-semibold text-white">Get started</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card-surface flex items-center p-6 text-white md:p-8">
          <div className="w-full">
            <div className="mb-6 flex rounded-full border border-white/8 bg-white/4 p-1 text-sm font-semibold text-white/55">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-full px-4 py-3 ${mode === "login" ? "bg-white text-[#060811] shadow" : ""}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-full px-4 py-3 ${mode === "signup" ? "bg-white text-[#060811] shadow" : ""}`}
              >
                Sign up
              </button>
            </div>

            <p className="kicker">Account access</p>
            <h2 className="mt-3 text-4xl font-semibold text-white">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/54">
              {mode === "login"
                ? "Continue with your credentials and jump right back into your finance cockpit."
                : "Set up your space and start receiving smarter spending insights."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {mode === "signup" ? (
                <input required name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="field-input" />
              ) : null}
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email address"
                className="field-input"
              />
              <input
                required
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="field-input"
              />

              {error ? <p className="rounded-[22px] border border-[#ff728d]/30 bg-[#ff728d]/10 px-4 py-3 text-sm text-[#ff9aaf]">{error}</p> : null}

              <button type="submit" disabled={loading} className="primary-button w-full disabled:opacity-70">
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
              </button>
            </form>

            {googleEnabled ? (
              <button
                type="button"
                onClick={() => {
                  window.location.href = `${apiBase}/auth/google`;
                }}
                className="secondary-button mt-4 w-full !text-white"
              >
                Continue with Google
              </button>
            ) : (
              <p className="mt-4 text-center text-xs text-white/38">
                Google sign-in appears when <code>VITE_GOOGLE_OAUTH_ENABLED=true</code> is configured.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
