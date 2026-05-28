import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "./Layout";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    verifyUser();
  }, []);

  const verifyUser = async () => {
    try {
      const res = await api.get("/verify");

      if (res.data.authenticated) {
        setAuthenticated(true);
      } else {
        navigate("/");
      }
    } catch (err) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100 px-4">
        <div className="panel w-full max-w-sm p-8 text-center">
          <h2 className="text-xl font-bold text-slate-950">Verifying Session</h2>
          <p className="mt-2 text-sm text-slate-500">Please wait...</p>
          <div className="mt-5 flex justify-center text-blue-600">
            <span className="h-10 w-10 spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (authenticated) {
    return <Layout>{children}</Layout>;
  }

  return null;
}
