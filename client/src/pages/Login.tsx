import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils";
import "../styles/Login.css";
import { Result } from "../../../types/types";

/**
 * @description This is the Login page for our project. It accepts user-inputted username/password
 *
 * @author rishavsarma5, krisamerman, eduardo-ruiz-garay
 */
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleRegisterSuccess = (data: Result) => {
    console.log(`SUCCESSFUL LOGIN:`);
    console.log(data);
    sessionStorage.setItem("auth", "authenticated");
    navigate("/dashboard");
  };

  const handleRegisterFailure = (data: Result) => {
    console.log(`FAILED LOGIN:`);
    console.log(data);
    sessionStorage.setItem("auth", "");
  };

  const onLoginButtonClick = async () => {
    setUsernameError("");
    setPasswordError("");

    if ("" === username) {
      setUsernameError("Username Invalid!");
      return;
    }

    if ("" === password) {
      setPasswordError("Password Invalid!");
      return;
    }

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("password", password);

    try {
      await fetchWithAuth(
        "http://localhost:3000/api/v1/register",
        { method: "GET" },
        (data) => handleRegisterSuccess(data),
        (data) => handleRegisterFailure(data)
      );
    } catch (error) {
      console.error("Error registering new user", error);
    }
  };

  return (
    <div className="login-container">
      <div className="loginPage">
        <h1>Welcome to HuskSheets!</h1>
        <br />
        <h2>Please enter your username and password below.</h2>
        <div className="inputContainer">
          <input
            value={username}
            placeholder="Enter your username here"
            onChange={(un) => setUsername(un.target.value)}
          />
          <label className="errorLabel">{usernameError}</label>
        </div>
        <br />
        <div className="inputContainer">
          <input
            value={password}
            placeholder="Enter your password here"
            onChange={(pw) => setPassword(pw.target.value)}
          />
          <label className="errorLabel">{passwordError}</label>
        </div>
        <input
          onClick={onLoginButtonClick}
          className="loginButton"
          type="button"
          value="Login"
        />
      </div>
    </div>
  );
}

export default Login;
