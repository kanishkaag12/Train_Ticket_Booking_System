import { Bell, Search, Shield, Ticket } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive ? "bg-white text-brand-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-hero">
      <div className="page-shell">
        <header className="glass-panel sticky top-4 z-20 rounded-[30px] px-5 py-4 shadow-glow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent-400/90 p-3 text-brand-950">
                <Ticket size={20} />
              </div>
              <div>
                <p className="font-display text-xl text-white">RailwayNext</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Smarter than legacy booking</p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2">
              <NavLink to="/" className={navLinkClass}>
                Search
              </NavLink>
              <NavLink to="/tickets" className={navLinkClass}>
                My Tickets
              </NavLink>
              {user?.role === "ROLE_ADMIN" && (
                <NavLink to="/admin" className={navLinkClass}>
                  Admin
                </NavLink>
              )}
            </nav>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 md:flex">
                <Bell size={16} className="text-accent-300" />
                Auto-upgrade alerts active
              </div>
              {user ? (
                <>
                  <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">
                    {user.fullName} | {user.role === "ROLE_ADMIN" ? "Admin" : "User"}
                  </div>
                  <button
                    onClick={logout}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-950">
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </header>

        <section className="grid gap-4 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="glass-panel rounded-[32px] px-6 py-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-accent-400/15 p-3 text-accent-300">
                <Search size={24} />
              </div>
              <div>
                <h1 className="font-display text-3xl text-white md:text-4xl">Book high-demand routes with live queue intelligence</h1>
                <p className="mt-3 max-w-3xl text-slate-300">
                  Search trains, track PNR status, and watch WL to RAC to CNF upgrades happen automatically when cancellations free inventory.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[32px] px-6 py-8">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white/10 p-3 text-white">
                <Shield size={22} />
              </div>
              <div>
                <h2 className="font-display text-xl text-white">Secure by default</h2>
                <p className="mt-2 text-sm text-slate-300">
                  JWT auth, role-based admin controls, booking history, refund simulation, and operational dashboards are built in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {children}
      </div>
    </div>
  );
}
