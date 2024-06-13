import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Sheet from "./pages/Sheet";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:publisher/:sheet"
          element={
            <ProtectedRoute>
              <Sheet />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
