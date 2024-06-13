import { useNavigate } from "react-router-dom";
import "../styles/Header.css";

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
			<button className="logout-button" onClick={handleLogout}>
				Logout
			</button>
		</header>
	);
}

export default Header;
