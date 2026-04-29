import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Sidebar, { navigationItems } from "./Sidebar";
import Topbar from "./Topbar";

const AppShell = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="mx-auto min-h-screen max-w-[1680px] px-4 py-4 lg:px-6">
      <div className="grid min-h-screen gap-6 grid-shell">
        <Sidebar />

        <div className="relative pb-28 lg:pb-6">
          {mobileOpen ? (
            <div className="card-surface mb-4 flex flex-col gap-2 p-4 lg:hidden">
              {navigationItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-semibold ${
                      isActive ? "bg-white text-[#05070d]" : "text-white/65"
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </div>
          ) : null}

          <Topbar onToggleMobileMenu={() => setMobileOpen((current) => !current)} />
          <main className="page-enter">
            <Outlet />
          </main>

          <nav className="card-surface fixed inset-x-4 bottom-4 z-20 grid grid-cols-5 gap-2 p-2 text-white lg:hidden">
            {navigationItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center rounded-[20px] px-2 py-3 text-[11px] font-semibold ${
                    isActive ? "bg-white text-[#060811]" : "text-white/55"
                  }`
                }
              >
                <Icon size={16} />
                <span className="mt-1">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
