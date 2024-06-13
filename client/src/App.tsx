import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Sheet from "./pages/Sheet";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

/**
 * The main application component that sets up routing and navigation.
 * Displays different pages based on the current route.
 * Shows a header except on the login page.
 *
 * @returns {JSX.Element} The rendered application component.
 * @author kris-amerman
 */
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

/**
 * Wrapper component that provides the router context to the App component.
 * 
 * @returns {JSX.Element} The wrapped application component with Router.
 * @see {@link App}
 * @author kris-amerman
 */
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
