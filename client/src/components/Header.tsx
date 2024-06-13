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
			<div className="buttons-container">
				<button className="header-button" onClick={() => navigate("/dashboard")}>Home</button>
				<button className="header-button" onClick={handleLogout}>Logout</button>
			</div>
			<p className="current-user">Endpoint version: {clientConfig.BASE_URL}</p>
			<p className="current-user">Current user: {sessionStorage.getItem("username")}</p>
		</header>
	);
}

export default Header;
