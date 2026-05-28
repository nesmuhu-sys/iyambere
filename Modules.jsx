import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({
    moduleId: "",
    moduleName: "",
    moduleCode: "",
    credits: "",
    tradeId: "",
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadModules = async () => {
    try {
      const res = await api.get("/modules");
      setModules(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadTrades = async () => {
    try {
      const res = await api.get("/trades");
      setTrades(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadModules();
    loadTrades();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveModule = async () => {
    setSuccess("");
    setError("");

    if (
      !form.moduleId.trim() ||
      !form.moduleName.trim() ||
      !form.moduleCode.trim() ||
      !form.credits ||
      !form.tradeId
    ) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);
      const payload = { ...form, credits: Number(form.credits) };

      if (editId) {
        await api.put(`/modules/${editId}`, payload);
        setSuccess("Module updated successfully");
      } else {
        await api.post("/modules", payload);
        setSuccess("Module added successfully");
      }

      resetForm();
      loadModules();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const editModule = (module) => {
    setForm({
      moduleId: module.moduleId,
      moduleName: module.moduleName,
      moduleCode: module.moduleCode,
      credits: module.credits,
      tradeId: module.tradeId,
    });
    setEditId(module.moduleId);
  };

  const deleteModule = async (moduleId) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;

    try {
      await api.delete(`/modules/${moduleId}`);
      loadModules();
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setForm({ moduleId: "", moduleName: "", moduleCode: "", credits: "", tradeId: "" });
    setEditId(null);
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Modules</h1>
          <p className="page-subtitle">Create, update and manage learning modules</p>
        </div>
        <span className="badge badge-muted">Total: {modules.length}</span>
      </header>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <section className="panel">
        <div className="panel-body space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="panel-title">{editId ? "Update Module" : "Add New Module"}</h2>
            {editId && <span className="badge badge-warning">Editing Mode</span>}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label>
              <span className="field-label">Module ID</span>
              <input
                name="moduleId"
                value={form.moduleId}
                onChange={handleChange}
                disabled={Boolean(editId)}
                placeholder="e.g., M001"
                className="field"
              />
            </label>

            <label>
              <span className="field-label">Module Name</span>
              <input
                name="moduleName"
                value={form.moduleName}
                onChange={handleChange}
                placeholder="e.g., Database Systems"
                className="field"
              />
            </label>

            <label>
              <span className="field-label">Module Code</span>
              <input
                name="moduleCode"
                value={form.moduleCode}
                onChange={handleChange}
                placeholder="e.g., DB101"
                className="field"
              />
            </label>

            <label>
              <span className="field-label">Credits</span>
              <input
                type="number"
                name="credits"
                value={form.credits}
                onChange={handleChange}
                placeholder="e.g., 10"
                className="field"
              />
            </label>

            <label className="lg:col-span-2">
              <span className="field-label">Trade</span>
              <select name="tradeId" value={form.tradeId} onChange={handleChange} className="field">
                <option value="">Select Trade</option>
                {trades.map((trade) => (
                  <option key={trade.tradeId} value={trade.tradeId}>
                    {trade.tradeName}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={saveModule} disabled={loading} className="btn btn-primary">
              {loading ? "Saving..." : editId ? "Update Module" : "Add Module"}
            </button>
            {editId && (
              <button onClick={resetForm} className="btn btn-outline">
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>

      {modules.length === 0 ? (
        <div className="empty-state">No modules created yet. Add your first module above.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Module ID</th>
                <th>Module Name</th>
                <th>Code</th>
                <th>Credits</th>
                <th>Trade ID</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((module) => (
                <tr key={module.moduleId}>
                  <td className="font-semibold text-slate-950">{module.moduleId}</td>
                  <td>{module.moduleName}</td>
                  <td>{module.moduleCode}</td>
                  <td>{module.credits}</td>
                  <td>{module.tradeId}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => editModule(module)} className="btn btn-warning">
                        Edit
                      </button>
                      <button onClick={() => deleteModule(module.moduleId)} className="btn btn-danger">
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
