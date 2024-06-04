import { Navigate } from "react-router-dom";

/**
 * @author kris-amerman
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = sessionStorage.getItem("auth") === "authenticated";
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;