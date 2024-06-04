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
            <button
                className="logout-button"
                onClick={handleLogout}
            >
                Logout
            </button>
        </header>
    );
}

export default Header;
