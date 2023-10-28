import React, { useContext, useEffect } from "react";
import AddTask from "./AddTask";
import TasksContainer from "./TasksContainer";
import Nav from "./Nav";
import socketIO from "socket.io-client";
import { AuthProvider } from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";

const socket = socketIO.connect("http://localhost:5000");

const Task = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, setUser, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    const data = localStorage.getItem("isloggedIn");
    const dataObj = JSON.parse(data);
    if (dataObj.isLoggedIn === false) {
      console.log("false");
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <div>
      <Nav />
      <TasksContainer socket={socket} />
    </div>
  );
};

export default Task;
