import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ tradeId: "", tradeName: "" });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadTrades = async () => {
    try {
      const res = await api.get("/trades");
      setTrades(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTrades();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveTrade = async () => {
    setSuccess("");
    setError("");

    if (!form.tradeId.trim() || !form.tradeName.trim()) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/trades/${editId}`, form);
        setSuccess("Trade updated successfully");
      } else {
        await api.post("/trades", form);
        setSuccess("Trade added successfully");
      }

      resetForm();
      loadTrades();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const editTrade = (trade) => {
    setForm({ tradeId: trade.tradeId, tradeName: trade.tradeName });
    setEditId(trade.tradeId);
  };

  const deleteTrade = async (tradeId) => {
    if (!window.confirm("Delete this trade?")) return;

    try {
      await api.delete(`/trades/${tradeId}`);
      loadTrades();
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setForm({ tradeId: "", tradeName: "" });
    setEditId(null);
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Trades</h1>
          <p className="page-subtitle">Create and maintain trade records</p>
        </div>
        <span className="badge badge-muted">Total: {trades.length}</span>
      </header>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <section className="panel">
        <div className="panel-body space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="panel-title">{editId ? "Update Trade" : "Add New Trade"}</h2>
            {editId && <span className="badge badge-warning">Editing Mode</span>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="field-label">Trade ID</span>
              <input
                name="tradeId"
                value={form.tradeId}
                onChange={handleChange}
                disabled={Boolean(editId)}
                placeholder="e.g., T001"
                className="field"
              />
            </label>

            <label>
              <span className="field-label">Trade Name</span>
              <input
                name="tradeName"
                value={form.tradeName}
                onChange={handleChange}
                placeholder="e.g., Information Technology"
                className="field"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={saveTrade} disabled={loading} className="btn btn-primary">
              {loading ? "Saving..." : editId ? "Update Trade" : "Add Trade"}
            </button>
            {editId && (
              <button onClick={resetForm} className="btn btn-outline">
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>

      {trades.length === 0 ? (
        <div className="empty-state">No trades found. Add your first trade above.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trade ID</th>
                <th>Trade Name</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.tradeId}>
                  <td className="font-semibold text-slate-950">{trade.tradeId}</td>
                  <td>{trade.tradeName}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => editTrade(trade)} className="btn btn-warning">
                        Edit
                      </button>
                      <button onClick={() => deleteTrade(trade.tradeId)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
