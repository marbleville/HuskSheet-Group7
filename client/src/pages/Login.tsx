import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithAuth } from "../utils";
import { Result } from "../../../types/types";
import "../styles/Login.css";

/**
 * @description The Login page. It handles username and password input. 
 * 
 * If a username does not exist in the DB, a new user will be created and register will automatically retry
 * to register the new user. If a username exists and the password is wrong, a 401 will trigger an invalid login view.
 *
 * @auth krisamerman, rishavsarma5, eduardo-ruiz-garay
 */
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");

  const [retry, setRetry] = useState(false);

  const navigate = useNavigate();

  /**
   * @description Attempts to fetch register and handles success and failure.
   * 
   * @auth kris-amerman
   */
  const attemptFetchWithAuth = async () => {
    try {
      await fetchWithAuth(
        "http://localhost:3000/api/v1/register",
        { method: "GET" },
        handleRegisterSuccess,
        handleRegisterFailure
      );
    } catch (error) {
      console.error("Error registering new user", error);
    }
  };

  /**
   * @description Sets a value for "auth" in sessionStorage. This is simply used to help with site navigation.
   * 
   * @auth kris-amerman
   */
  const handleRegisterSuccess = () => {
    sessionStorage.setItem("auth", "authenticated");
    navigate("/dashboard");
  };

  /**
   * @description Triggers a fail state for the Login UI.
   * 
   * If the failure reason is a registration failure (i.e., user DNE), it retries the registration process once.
   * 
   * @param {Result} data - The response data from the failed fetch.
   * 
   * @auth kris-amerman
   */
  const handleRegisterFailure = async (data: Result) => {
    // Do not retry if already retried or if the error is unauthorized (401)
    if (retry || data.message === "Unauthorized") {
      setRetry(false);
      if (data.message === "Unauthorized") {
        setAuthError("Username and password do not match.");
      } else {
        console.error(`Failed to login: ${data}`);
      }
      return;
    }

    // Retry registration if the first attempt fails and hasn't retried yet
    if (data) {
      setRetry(true);
      await attemptFetchWithAuth();
    }
  };

  /**
   * @description Handles login. Sets username and password in sessionStorage (to persist across page loads).
   * 
   * @auth kris-amerman, rishavsarma5
   */
  const onLoginButtonClick = async () => {
    setUsernameError("");
    setPasswordError("");
    setAuthError("");

    if (username === "") {
      setUsernameError("Username Invalid!");
      return;
    }

    if (password === "") {
      setPasswordError("Password Invalid!");
      return;
    }

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("password", password);

    await attemptFetchWithAuth();
  };

  /**
   * @description Renders the login UI.
   * 
   * @auth rishavsarma5, kris-amerman
   */
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
        <br />
        {authError && <div className="authErrorLabel">{authError}</div>}
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
