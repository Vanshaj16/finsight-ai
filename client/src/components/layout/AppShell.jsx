import { NavLink, Outlet } from "react-router-dom";
import Sidebar, { navigationItems } from "./Sidebar";
import Topbar from "./Topbar";

const AppShell = () => {
  return (
    <div className="mx-auto min-h-screen max-w-[1680px] px-4 py-4 lg:px-6">
      <div className="grid min-h-screen gap-6 grid-shell">
        <Sidebar />

        <div className="relative pb-28 lg:pb-6">
          <Topbar />
          <main className="page-enter">
            <Outlet />
          </main>

          <nav className="mobile-nav-scroll card-surface fixed inset-x-4 bottom-4 z-20 flex gap-2 overflow-x-auto p-2 text-white lg:hidden">
            {navigationItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex min-w-[84px] shrink-0 snap-start flex-col items-center justify-center rounded-[20px] px-3 py-3 text-[11px] font-semibold whitespace-nowrap ${
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

