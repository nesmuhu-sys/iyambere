import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [modules, setModules] = useState([]);
  const [form, setForm] = useState({
    traineeId: "",
    moduleId: "",
    formativeAssessment: "",
    summativeAssessment: "",
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadMarks = async () => {
    try {
      const res = await api.get("/marks");
      setMarks(res.data);
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

  const loadModules = async () => {
    try {
      const res = await api.get("/modules");
      setModules(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadMarks();
    loadTrainees();
    loadModules();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const totalMarks =
    Number(form.formativeAssessment || 0) + Number(form.summativeAssessment || 0);

  const saveMarks = async () => {
    setSuccess("");
    setError("");

    if (
      !form.traineeId ||
      !form.moduleId ||
      form.formativeAssessment === "" ||
      form.summativeAssessment === ""
    ) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);
      const payload = {
        ...form,
        formativeAssessment: Number(form.formativeAssessment),
        summativeAssessment: Number(form.summativeAssessment),
        totalMarks,
      };

      if (editId) {
        await api.put(`/marks/${editId}`, payload);
        setSuccess("Marks updated successfully");
      } else {
        await api.post("/marks", payload);
        setSuccess("Marks recorded successfully");
      }

      resetForm();
      loadMarks();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const editMarks = (mark) => {
    setForm({
      traineeId: mark.traineeId,
      moduleId: mark.moduleId,
      formativeAssessment: mark.formativeAssessment,
      summativeAssessment: mark.summativeAssessment,
    });
    setEditId(mark._id);
  };

  const deleteMarks = async (id) => {
    if (!window.confirm("Delete this mark?")) return;

    try {
      await api.delete(`/marks/${id}`);
      loadMarks();
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setForm({
      traineeId: "",
      moduleId: "",
      formativeAssessment: "",
      summativeAssessment: "",
    });
    setEditId(null);
  };

  const getTraineeName = (id) => {
    const trainee = trainees.find((t) => t.traineeId === id);
    return trainee ? `${trainee.firstName} ${trainee.lastName}` : id;
  };

  const getModuleName = (id) => {
    const module = modules.find((m) => m.moduleId === id);
    return module ? module.moduleName : id;
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Marks</h1>
          <p className="page-subtitle">Record and manage trainee assessment marks</p>
        </div>
        <span className="badge badge-muted">Total: {marks.length}</span>
      </header>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <section className="panel">
        <div className="panel-body space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="panel-title">{editId ? "Update Marks" : "Record Marks"}</h2>
            {editId && <span className="badge badge-warning">Editing Mode</span>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="field-label">Trainee</span>
              <select name="traineeId" value={form.traineeId} onChange={handleChange} className="field">
                <option value="">Select Trainee</option>
                {trainees.map((trainee) => (
                  <option key={trainee.traineeId} value={trainee.traineeId}>
                    {trainee.firstName} {trainee.lastName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="field-label">Module</span>
              <select name="moduleId" value={form.moduleId} onChange={handleChange} className="field">
                <option value="">Select Module</option>
                {modules.map((module) => (
                  <option key={module.moduleId} value={module.moduleId}>
                    {module.moduleName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="field-label">Formative Assessment (0-50)</span>
              <input
                type="number"
                name="formativeAssessment"
                value={form.formativeAssessment}
                onChange={handleChange}
                placeholder="0 - 50"
                max="50"
                min="0"
                className="field"
              />
            </label>

            <label>
              <span className="field-label">Summative Assessment (0-50)</span>
              <input
                type="number"
                name="summativeAssessment"
                value={form.summativeAssessment}
                onChange={handleChange}
                placeholder="0 - 50"
                max="50"
                min="0"
                className="field"
              />
            </label>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-600">Total Marks</p>
            <p className="mt-1 text-3xl font-bold text-slate-950">{totalMarks}/100</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={saveMarks} disabled={loading} className="btn btn-primary">
              {loading ? "Saving..." : editId ? "Update Marks" : "Save Marks"}
            </button>
            {editId && (
              <button onClick={resetForm} className="btn btn-outline">
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>

      {marks.length === 0 ? (
        <div className="empty-state">No marks recorded yet. Add marks above.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trainee</th>
                <th>Module</th>
                <th className="text-center">Formative</th>
                <th className="text-center">Summative</th>
                <th className="text-center">Total</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark) => (
                <tr key={mark._id}>
                  <td className="font-semibold text-slate-950">{getTraineeName(mark.traineeId)}</td>
                  <td>{getModuleName(mark.moduleId)}</td>
                  <td className="text-center">{mark.formativeAssessment}</td>
                  <td className="text-center">{mark.summativeAssessment}</td>
                  <td className="text-center font-semibold text-slate-950">{mark.totalMarks}</td>
                  <td className="text-center">
                    <span className={`badge ${mark.totalMarks >= 70 ? "badge-success" : "badge-danger"}`}>
                      {mark.totalMarks >= 70 ? "Competent" : "Not Yet"}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => editMarks(mark)} className="btn btn-warning">
                        Edit
                      </button>
                      <button onClick={() => deleteMarks(mark._id)} className="btn btn-danger">
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
