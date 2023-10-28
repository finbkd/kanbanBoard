import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currMode, setCurrMode] = useState("login");
  const navigate = useNavigate();

  const { isLoggedIn, user, setUser, setIsLoggedIn } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    // localStorage.setItem("userId", username);
    const fetchLogin = async () => {
      await fetch(`http://localhost:5000/user/${currMode}`, {
        method: "POST",
        mode: "cors", // this cannot be 'no-cors'
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
        .then(function (res) {
          JSON.stringify(res);
          setUser(username);
          setIsLoggedIn(true);
          localStorage.setItem(
            "isloggedIn",
            JSON.stringify({ isLoggedIn: true })
          );
          navigate("/task");
        })
        .catch(function (res) {
          console.log(res);
        });
    };
    fetchLogin();

    // setUsername("");
    // setPassword("");
    // navigate("/task");
  };

  return (
    <div className="login__container">
      <form className="login__form" onSubmit={handleLogin}>
        <div className="loginTitle">TASK BOARD</div>
        <label htmlFor="username">Please provide below credentials</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="username"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          type="text"
          name="username"
          id="username"
          placeholder="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <button>{currMode}</button>
        <div
          className="loginBtn"
          onClick={() => {
            if (currMode === "login") {
              setCurrMode("register");
            } else {
              setCurrMode("login");
            }
          }}
        >
          {currMode === "login" ? "register" : "login"}
        </div>
      </form>
    </div>
  );
};

export default Login;
