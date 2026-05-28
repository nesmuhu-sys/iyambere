import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    trades: 0,
    trainees: 0,
    modules: 0,
    competent: 0,
    notCompetent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard-stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Trades", value: stats.trades, path: "/trades", accent: "text-blue-600" },
    { title: "Trainees", value: stats.trainees, path: "/trainees", accent: "text-emerald-600" },
    { title: "Modules", value: stats.modules, path: "/modules", accent: "text-violet-600" },
    { title: "Competent", value: stats.competent, path: "/reports", accent: "text-teal-600" },
    { title: "Not Competent", value: stats.notCompetent, path: "/reports", accent: "text-red-600" },
  ];

  const actions = [
    { title: "Manage Trades", text: "Create and edit trades", path: "/trades" },
    { title: "Register Trainees", text: "Add and manage trainees", path: "/trainees" },
    { title: "Record Marks", text: "Enter assessment scores", path: "/marks" },
    { title: "Create Modules", text: "Add and organize modules", path: "/modules" },
    { title: "View Reports", text: "Performance analytics", path: "/reports" },
  ];

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">School Management System overview</p>
        </div>
        <span className="badge badge-success">System Active</span>
      </header>

      {loading ? (
        <div className="panel p-10 text-center text-blue-600">
          <span className="mx-auto h-10 w-10 spinner" />
          <p className="mt-4 text-sm font-medium text-slate-600">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((card) => (
              <button
                key={card.title}
                onClick={() => navigate(card.path)}
                className="metric-card"
              >
                <p className="metric-label">{card.title}</p>
                <p className={`metric-value ${card.accent}`}>{card.value}</p>
              </button>
            ))}
          </div>

          <section className="panel">
            <div className="panel-body">
              <div className="mb-5">
                <h2 className="panel-title">Quick Actions</h2>
                <p className="page-subtitle">Common management tasks</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {actions.map((action) => (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.path)}
                    className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <span className="font-semibold text-slate-950">{action.title}</span>
                    <span className="mt-1 block text-sm text-slate-500">{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  );
}
