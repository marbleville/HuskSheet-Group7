import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = sessionStorage.getItem("auth") === "authorized";
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;