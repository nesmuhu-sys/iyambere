import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ userId: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.userId.trim() || !form.username.trim() || !form.password.trim()) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);
      await api.post("/users", form);
      setSuccess("Account created successfully!");
      setForm({ userId: "", username: "", password: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="mb-6 text-center">
          <p className="text-2xl font-bold text-slate-950">Create Account</p>
          <p className="mt-1 text-sm text-slate-500">Register Deputy School Manager</p>
        </div>

        {error && <div className="alert alert-danger mb-4 text-center">{error}</div>}
        {success && <div className="alert alert-success mb-4 text-center">{success}</div>}

        <form onSubmit={register} className="space-y-4">
          <label>
            <span className="field-label">User ID</span>
            <input
              type="text"
              name="userId"
              placeholder="Enter user ID"
              value={form.userId}
              onChange={handleChange}
              className="field"
            />
          </label>

          <label>
            <span className="field-label">Username</span>
            <input
              type="text"
              name="username"
              placeholder="Choose username"
              value={form.username}
              onChange={handleChange}
              className="field"
            />
          </label>

          <label>
            <span className="field-label">Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={form.password}
              onChange={handleChange}
              className="field"
            />
          </label>

          <button type="submit" disabled={loading} className="btn btn-success w-full">
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/" className="font-semibold text-blue-600 hover:text-blue-700">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
