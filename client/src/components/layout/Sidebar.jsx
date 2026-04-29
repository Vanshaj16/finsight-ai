import { BarChart3, Bot, LayoutDashboard, ReceiptIndianRupee, Target } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ReceiptIndianRupee },
  { to: "/budget", label: "Budget", icon: Target },
  { to: "/insights", label: "AI Insights", icon: BarChart3 },
  { to: "/chatbot", label: "Assistant", icon: Bot },
];

export const navigationItems = items;

const navClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-semibold transition ${
    isActive
      ? "bg-white text-[#060811] shadow-[0_16px_40px_rgba(255,255,255,0.12)]"
      : "text-white/62 hover:bg-white/8 hover:text-white"
  }`;

const Sidebar = () => (
  <aside className="card-surface hidden h-[calc(100vh-2rem)] flex-col gap-8 overflow-y-auto p-6 lg:flex">
    <div className="flex-1">
      <div className="mb-8">
        <div className="kicker">FinSight AI</div>
        <h1 className="hero-title mt-4 text-[3.75rem] leading-[0.9] text-white">Spend wisely every day</h1>
        <p className="mt-4 max-w-xs text-sm leading-7 text-white/58">
          A premium finance cockpit for tracking habits, budgets, and AI-guided decisions.
        </p>
      </div>

      <div className="mb-6 flex items-center justify-center">
        <div className="orb-ring h-32 w-32 opacity-95" />
      </div>

      <nav className="space-y-2 pb-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={navClass}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>

    <div className="shrink-0 rounded-[28px] border border-white/8 bg-white/4 p-5 text-white">
      <p className="kicker">Way forward</p>
      <p className="mt-3 text-lg font-semibold">Control the day before it controls your budget.</p>
      <p className="mt-2 text-sm leading-6 text-white/60">
        FinSight AI highlights trends early so your weekly decisions feel lighter and more deliberate.
      </p>
    </div>
  </aside>
);

export default Sidebar;
