import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", short: "DB" },
    { name: "Trades", path: "/trades", short: "TR" },
    { name: "Trainees", path: "/trainees", short: "TN" },
    { name: "Modules", path: "/modules", short: "MD" },
    { name: "Marks", path: "/marks", short: "MK" },
    { name: "Reports", path: "/reports", short: "RP" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="border-b border-slate-800 p-5">
          <p className="text-lg font-bold">School System</p>
          <p className="mt-1 text-xs text-slate-400">Deputy Manager Panel</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-xs">
                  {link.short}
                </span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
          School Management System
          <span className="block">© {new Date().getFullYear()}</span>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
