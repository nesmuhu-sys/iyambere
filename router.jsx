import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Trades from "./pages/Trades";
import Trainees from "./pages/Trainees";
import Modules from "./pages/Modules";
import Marks from "./pages/Marks";
import Reports from "./pages/Reports";

import ProtectedRoute from "./components/ProtectedRoute";

// ================= ROUTER =================
export const router = createBrowserRouter([
  // LOGIN
  {
    path: "/",
    element: <Login />,
  },

  // SIGNUP
  {
    path: "/signup",
    element: <Signup />,
  },

  // DASHBOARD
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },

  // TRADES
  {
    path: "/trades",
    element: (
      <ProtectedRoute>
        <Trades />
      </ProtectedRoute>
    ),
  },

  // TRAINEES
  {
    path: "/trainees",
    element: (
      <ProtectedRoute>
        <Trainees />
      </ProtectedRoute>
    ),
  },

  // MODULES
  {
    path: "/modules",
    element: (
      <ProtectedRoute>
        <Modules />
      </ProtectedRoute>
    ),
  },

  // MARKS
  {
    path: "/marks",
    element: (
      <ProtectedRoute>
        <Marks />
      </ProtectedRoute>
    ),
  },

  // REPORTS
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
]);