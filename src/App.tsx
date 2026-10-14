import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import PublicRoute from "./guard/PublicRoute";
import ProtectedRoute from "./guard/ProtectedRoute";
import LoginForm from "./components/LoginForm";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Employees from "./pages/Employees";
import Menus from "./pages/Menus";
import Stock from "./pages/Stock";
import Orders from "./pages/Orders";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route
            path="/login"
            element={
              <LoginForm
                role="all"
                title="Login Portal"
                subtitle="Sign in to manage the selling point system"
              />
            }
          />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/menus" element={<Menus />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/table" element={<Dashboard />} />
            <Route path="/stock" element={<Stock />} />
          </Route>
          <Route path="*" element={<Navigate to={"/dashboard"} replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
