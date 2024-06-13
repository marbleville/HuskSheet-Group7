import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import clientConfig from "../config/clientConfig";

function Header() {
	const navigate = useNavigate();

	const handleLogout = () => {
		sessionStorage.removeItem("username");
		sessionStorage.removeItem("password");
		sessionStorage.removeItem("auth");
		navigate("/");
	};

	return (
		<header className="header-container">
			<p className="current-user">Current user: {sessionStorage.getItem("username")}</p>
			<p className="current-user">Endpoint version: {clientConfig.BASE_URL}</p>
			<button className="logout-button" onClick={handleLogout}>
				Logout
			</button>
		</header>
	);
}

export default Header;
