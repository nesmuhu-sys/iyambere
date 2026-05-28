import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    try {
      const res = await api.get("/reports");
      setReports(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTrainees = async () => {
    try {
      const res = await api.get("/trainees");
      setTrainees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([loadReports(), loadTrainees()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getTraineeName = (id) => {
    const trainee = trainees.find((t) => t.traineeId === id);
    return trainee ? `${trainee.firstName} ${trainee.lastName}` : id;
  };

  const competent = reports.filter((r) => r.totalMarks >= 70);
  const notCompetent = reports.filter((r) => r.totalMarks < 70);
  const averageMarks =
    reports.length > 0
      ? (reports.reduce((total, report) => total + report.totalMarks, 0) / reports.length).toFixed(1)
      : 0;
  const highestMark = reports.length > 0 ? Math.max(...reports.map((r) => r.totalMarks)) : 0;

  const stats = [
    { label: "Total Records", value: reports.length, color: "text-blue-600" },
    { label: "Competent", value: competent.length, color: "text-emerald-600" },
    { label: "Not Yet Competent", value: notCompetent.length, color: "text-red-600" },
    { label: "Average Marks", value: `${averageMarks}%`, color: "text-violet-600" },
  ];

  const printReport = () => {
    window.print();
  };

  return (
    <section className="page print-report">
      <header className="page-header">
        <div>
          <h1 className="page-title">Performance Reports</h1>
          <p className="page-subtitle">View trainee performance analytics and outcomes</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {reports.length > 0 && <span className="badge badge-warning">Highest Mark: {highestMark}%</span>}
          <button
            type="button"
            onClick={printReport}
            disabled={loading || reports.length === 0}
            className="btn btn-primary"
          >
            Print PDF
          </button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="metric-card">
            <p className="metric-label">{stat.label}</p>
            <p className={`metric-value ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="panel p-10 text-center text-blue-600">
          <span className="mx-auto h-10 w-10 spinner" />
          <p className="mt-4 text-sm font-medium text-slate-600">Loading reports...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="empty-state">No report data found yet.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trainee ID</th>
                <th>Full Name</th>
                <th className="text-center">Total Marks</th>
                <th className="text-center">Status</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr key={`${report.traineeId}-${index}`}>
                  <td className="font-semibold text-slate-950">{report.traineeId}</td>
                  <td>{getTraineeName(report.traineeId)}</td>
                  <td className="text-center font-semibold text-slate-950">{report.totalMarks}%</td>
                  <td className="text-center">
                    <span className={`badge ${report.totalMarks >= 70 ? "badge-success" : "badge-danger"}`}>
                      {report.totalMarks >= 70 ? "Competent" : "Not Yet Competent"}
                    </span>
                  </td>
                  <td>
                    {report.totalMarks >= 90
                      ? "Excellent"
                      : report.totalMarks >= 70
                      ? "Good"
                      : "Needs Improvement"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="panel">
          <div className="panel-body">
            <h2 className="panel-title text-emerald-700">Competent Trainees</h2>
            {competent.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No competent trainees yet.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {competent.map((trainee, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <span className="font-medium text-slate-900">{getTraineeName(trainee.traineeId)}</span>
                    <span className="badge badge-success">{trainee.totalMarks}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-body">
            <h2 className="panel-title text-red-700">Not Yet Competent</h2>
            {notCompetent.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">All trainees are competent.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {notCompetent.map((trainee, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                    <span className="font-medium text-slate-900">{getTraineeName(trainee.traineeId)}</span>
                    <span className="badge badge-danger">{trainee.totalMarks}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
