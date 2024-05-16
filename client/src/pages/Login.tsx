import { useState } from "react";

/**
 * @author Rishav Sarma
 * @description This is the Login page for our project. It accepts user-inputted username/password
 */
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const[usernameError, setUsernameError] = useState("");
  const[passwordError, setPasswordError] = useState("");

  const onButtonClick = () => {
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

  }

  return (
    <>
      <h1>Welcome to HuskSheets!</h1>
      <br />
      <h2>Please enter your username and password below.</h2>
        <div className="inputContainer">
            <input
                value = {username}
                placeholder = "Enter your username here" 
                onChange = {(un) => setUsername(un.target.value)}
            />
            <label className='errorLabel'>{usernameError}</label>
        </div>
        <br />
        <div className="inputContainer">
            <input
                value = {password}
                placeholder = "Enter your password here" 
                onChange = {(pw) => setPassword(pw.target.value)}
            />
            <label className='errorLabel'>{passwordError}</label>
        </div>
        <input onClick={onButtonClick}
            className="loginButton"
            type="button"      
            value="Login"
        />
    </>
  );
}

export default Login;
