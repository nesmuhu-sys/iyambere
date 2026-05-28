import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar() {
  const [username, setUsername] = useState("Deputy Manager");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/verify");

      if (res.data?.user?.username) {
        setUsername(res.data.user.username);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await api.get("/logout");
      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="topbar">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-slate-950 sm:text-lg">
            School Management System
          </p>
          <p className="text-xs text-slate-500 sm:text-sm">
            Deputy School Manager Dashboard
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-lg bg-slate-100 px-3 py-2 sm:flex">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {username.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">{username}</p>
              <p className="text-xs text-slate-500">Deputy Manager</p>
            </div>
          </div>

          <button
            onClick={logout}
            disabled={loading}
            className="btn btn-danger"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </header>
  );
}
