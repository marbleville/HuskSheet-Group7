import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils";

/**
 * @author Rishav Sarma, Kris Amerman, eduardo-ruiz-garay
 * @description This is the Login page for our project. It accepts user-inputted username/password
 */
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const onLoginButtonClick = () => {
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

    // Navigate to the dashboard
    navigate("/dashboard");
  };

  const onRegisterButtonClick = async () => {
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

    const argument = {
      username: username,
      password: password,
    };

    try {
      await fetchWithAuth("http://localhost:3000/api/v1/register", {
        method: "GET",
        body: JSON.stringify(argument),
      });
    } catch (error) {
      console.error("Error registering new user", error);
    }

    // Navigate to the dashboard
    navigate("/dashboard");
  };

  return (
    <>
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
      <input
        onClick={onRegisterButtonClick}
        className="registerButton"
        type="button"
        value="Register"
      />
    </>
  );
}

export default Login;
