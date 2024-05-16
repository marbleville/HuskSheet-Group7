import { useState } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <h1>Welcome to HuskSheets!</h1>
      <br />
      <h2>Please enter your username and password below.</h2>
      <div className="inputContainer">
        <input>
          value = {username}
          placeholder = "Enter your username here" onChange ={" "}
          {(un) => setUsername(un.target.value)}
        </input>
      </div>
      <br />
      <div className="inputContainer">
        <input>
          value = {password}
          placeholder = "Enter your password here" onChange ={" "}
          {(pw) => setPassword(pw.target.value)}
        </input>
      </div>
    </>
  );
}

export default Login;
