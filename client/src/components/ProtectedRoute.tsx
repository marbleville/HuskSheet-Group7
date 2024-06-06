import { Navigate } from "react-router-dom";

/**
 * Protects a route from being accessed by unauthenticated users.
 *
 * @author kris-amerman
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
	const isAuthenticated = sessionStorage.getItem("auth") === "authenticated";
	return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
