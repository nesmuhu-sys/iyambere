import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      return setError("Please enter username and password");
    }

    try {
      setLoading(true);
      await api.post("/login", form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="mb-6 text-center">
          <p className="text-2xl font-bold text-slate-950">Welcome Back</p>
          <p className="mt-1 text-sm text-slate-500">Deputy School Manager Login</p>
        </div>

        {error && <div className="alert alert-danger mb-4 text-center">{error}</div>}

        <form onSubmit={login} className="space-y-4">
          <label>
            <span className="field-label">Username</span>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
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
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              className="field"
            />
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Do not have an account?{" "}
          <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
            Create Account
          </Link>
        </p>
      </section>
    </main>
  );
}
