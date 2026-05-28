import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Trainees() {
  const [trainees, setTrainees] = useState([]);
  const [form, setForm] = useState({
    traineeId: "",
    firstName: "",
    lastName: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const loadTrainees = async () => {
    try {
      const res = await api.get("/trainees");
      setTrainees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTrainees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveTrainee = async () => {
    setSuccess("");
    setError("");

    if (
      !form.traineeId.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.gender.trim()
    ) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/trainees/${editId}`, form);
        setSuccess("Trainee updated successfully");
      } else {
        await api.post("/trainees", form);
        setSuccess("Trainee added successfully");
      }

      resetForm();
      loadTrainees();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const editTrainee = (trainee) => {
    setForm({
      traineeId: trainee.traineeId,
      firstName: trainee.firstName,
      lastName: trainee.lastName,
      gender: trainee.gender,
    });
    setEditId(trainee.traineeId);
  };

  const deleteTrainee = async (traineeId) => {
    if (!window.confirm("Are you sure you want to delete this trainee?")) return;

    try {
      await api.delete(`/trainees/${traineeId}`);
      loadTrainees();
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setForm({ traineeId: "", firstName: "", lastName: "", gender: "" });
    setEditId(null);
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Trainees</h1>
          <p className="page-subtitle">Register, edit and manage trainees</p>
        </div>
        <span className="badge badge-muted">Total: {trainees.length}</span>
      </header>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <section className="panel">
        <div className="panel-body space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="panel-title">{editId ? "Update Trainee" : "Register New Trainee"}</h2>
            {editId && <span className="badge badge-warning">Editing Mode</span>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="field-label">Trainee ID</span>
              <input
                name="traineeId"
                value={form.traineeId}
                onChange={handleChange}
                disabled={Boolean(editId)}
                placeholder="e.g., TR001"
                className="field"
              />
            </label>

            <label>
              <span className="field-label">First Name</span>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="e.g., John"
                className="field"
              />
            </label>

            <label>
              <span className="field-label">Last Name</span>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="e.g., Doe"
                className="field"
              />
            </label>

            <label>
              <span className="field-label">Gender</span>
              <select name="gender" value={form.gender} onChange={handleChange} className="field">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={saveTrainee} disabled={loading} className="btn btn-success">
              {loading ? "Saving..." : editId ? "Update Trainee" : "Add Trainee"}
            </button>
            {editId && (
              <button onClick={resetForm} className="btn btn-outline">
                Cancel
              </button>
            )}
          </div>
        </div>
      </section>

      {trainees.length === 0 ? (
        <div className="empty-state">No trainees registered yet. Add your first trainee above.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trainee ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainees.map((trainee) => (
                <tr key={trainee.traineeId}>
                  <td className="font-semibold text-slate-950">{trainee.traineeId}</td>
                  <td>{trainee.firstName}</td>
                  <td>{trainee.lastName}</td>
                  <td>
                    <span className="badge badge-muted">{trainee.gender}</span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => editTrainee(trainee)} className="btn btn-warning">
                        Edit
                      </button>
                      <button onClick={() => deleteTrainee(trainee.traineeId)} className="btn btn-danger">
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
