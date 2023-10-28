import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import uncheckedIcon from "../assets/checkedIcon.png";

const TasksContainer = ({ socket }) => {
  const [tasks, setTasks] = useState([]);
  const [listName, setListName] = useState("");
  const [task, setTask] = useState("");
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    await fetch("http://localhost:5000/todos/1")
      .then((res) => res.json())
      .then((data) => {
        let arr = [...data];
        setTasks(arr);
      });
  }

  const addTaskHandler = async (taskId, taskName) => {
    if (taskName.length === 0) return;
    await fetch(`http://localhost:5000/task`, {
      method: "POST",
      mode: "cors", // this cannot be 'no-cors'
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: taskName,
        todoId: taskId,
      }),
    }).then(() => fetchTasks());
    setTaskName("");
  };

  const addListHandler = async (listName) => {
    if (listName.length === 0) return;
    await fetch(`http://localhost:5000/todos`, {
      method: "POST",
      mode: "cors", // this cannot be 'no-cors'
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: listName,
        userId: 1,
      }),
    }).then(() => fetchTasks());
    setListName("");
  };

  const deleteTaskHandler = async (taskId) => {
    await fetch(`http://localhost:5000/task/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => fetchTasks());
  };

  // useEffect(() => {
  //   socket.on("tasks", (data) => {
  //     setTasks(data);
  //   });
  // }, [socket]);

  const handleDragEnd = ({ destination, source, draggableId }) => {
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;
    //  fetch('http://localhost:5000/task/${draggableId}', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({a: 1, b: 'Textual content'})
    // });

    const fetchData = async () => {
      let taskData = {};

      await fetch(`http://localhost:5000/task/${draggableId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          taskData = JSON.parse(JSON.stringify(res));
        });

      await fetch(`http://localhost:5000/task/${draggableId}`, {
        method: "DELETE",
      }).then((res) => res.json()); // or res.json()

      await fetch(`http://localhost:5000/task`, {
        method: "POST",
        mode: "cors", // this cannot be 'no-cors'
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: taskData.taskName,
          todoId: destination.droppableId,
          task_finished: taskData.taskFinished,
        }),
      }).then(() => fetchTasks()); // or res.json()
    };
    fetchData();
  };

  return (
    <div className="container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {tasks &&
          tasks?.map((task) => (
            <div key={task.todosId} className={`tasks__wrapper`}>
              <h3>{task.todosName}</h3>
              <div className={`tasks__container`}>
                <div className="tasksContainer">
                  <Droppable droppableId={`${task.todosId}`}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {task.tasks.map((item, index) => (
                          <Draggable
                            key={`${item.taskId}`}
                            draggableId={`${item.taskId}`}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`tasks__items`}
                              >
                                <div className="taskContainer">
                                  <img
                                    src={uncheckedIcon}
                                    height={25}
                                    width={25}
                                    className="checkedIcon"
                                    onClick={() => {
                                      deleteTaskHandler(item.taskId);
                                    }}
                                  />
                                  <p>{item.taskName}</p>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                <div className="addTaskContainer">
                  <input
                    onChange={(e) => {
                      setTaskName(e.target.value);
                    }}
                    className="inputContainer"
                    placeholder="Add Task..."
                  ></input>
                  <div
                    onClick={() => addTaskHandler(task.todosId, taskName)}
                    className="addTask"
                  >
                    Add Task
                  </div>
                </div>
              </div>
            </div>
          ))}
        <div key={task.todosId} className={`tasks__wrapper`}>
          <h3>Add List</h3>
          <div className={`tasks__container`}>
            <div className="addListContainer">
              <input
                onChange={(e) => {
                  setListName(e.target.value);
                }}
                className="inputContainer"
              ></input>
              <div onClick={() => addListHandler(listName)} className="addList">
                Add List
              </div>
            </div>
          </div>
        </div>

        {/* <div className="ongoing__wrapper">
          <div className="ongoing__items">
            <p>Ongoing Tasks</p>
            <p className="comment">
              <Link to="/comments">2 comments</Link>
            </p>
          </div>
        </div>
        <div className="completed__wrapper">
          <div className="completed__items">
            <p>Completed Tasks</p>
            <p className="comment">
              <Link to="/comments">2 comments</Link>
            </p>
          </div>
        </div> */}
      </DragDropContext>
    </div>
  );
};

export default TasksContainer;
