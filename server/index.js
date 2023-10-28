const express = require("express");
const app = express();
const cors = require("cors");
const { Todos, Task, User } = require("./db");
const http = require("http").Server(app);
const PORT = 5000;
const bcrypt = require("bcryptjs");

const fetchID = () => Math.random().toString(36).substring(2, 10);

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

let tasks = {
  pending: {
    title: "pending",
    items: [
      {
        id: fetchID(),
        title: "Send the Figma file to Dima",
        comments: [],
      },
    ],
  },
  ongoing: {
    title: "ongoing",
    items: [
      {
        id: fetchID(),
        title: "Review GitHub issues",
        comments: [
          {
            name: "David",
            text: "Ensure you review before merging",
            id: fetchID(),
          },
        ],
      },
    ],
  },
  completed: {
    title: "completed",
    items: [
      {
        id: fetchID(),
        title: "Create technical contents",
        comments: [
          {
            name: "Dima",
            text: "Make sure you check the requirements",
            id: fetchID(),
          },
        ],
      },
    ],
  },
};

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("createTask", (data) => {
    const newTask = { id: fetchID(), title: data.task, comments: [] };
    tasks["pending"].items.push(newTask);
    socket.emit("tasks", tasks);

    // 👇🏻 sends notification via Novu
    // sendNotification(data.userId);
  });

  socket.on("taskDragged", (data) => {
    const { source, destination } = data;
    const itemMoved = {
      ...tasks[source.droppableId].items[source.index],
    };
    console.log("ItemMoved>>> ", itemMoved);
    tasks[source.droppableId].items.splice(source.index, 1);
    tasks[destination.droppableId].items.splice(
      destination.index,
      0,
      itemMoved
    );
    console.log("Source >>>", tasks[source.droppableId].items);
    console.log("Destination >>>", tasks[destination.droppableId].items);
    socket.emit("tasks", tasks);
  });

  // socket.on("fetchComments", (data) => {
  // 	const taskItems = tasks[data.category].items;
  // 	for (let i = 0; i < taskItems.length; i++) {
  // 		if (taskItems[i].id === data.id) {
  // 			socket.emit("comments", taskItems[i].comments);
  // 		}
  // 	}
  // });
  // socket.on("addComment", (data) => {
  // 	const taskItems = tasks[data.category].items;
  // 	for (let i = 0; i < taskItems.length; i++) {
  // 		if (taskItems[i].id === data.id) {
  // 			taskItems[i].comments.push({
  // 				name: data.userId,
  // 				text: data.comment,
  // 				id: fetchID(),
  // 			});
  // 			socket.emit("comments", taskItems[i].comments);
  // 		}
  // 	}
  // });
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.post("/todos", async (req, res) => {
  try {
    const { name, userId } = req.body;
    const todo = await Todos.create({
      todosName: name, // 1 is the ID of the post you want to comment on
      userIdd: userId,
    });

    res.json("TodoList created successfully");
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/task", async (req, res) => {
  try {
    const { name, todoId } = req.body;
    // console.log(Name);
    const task = await Task.create({
      taskName: name, // 1 is the ID of the post you want to comment on
      taskFinished: false,
      todoId: todoId,
      todoTodosId: todoId,
    });

    res.json("Task created successfully");
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Todos.findAll({
      where: {
        userIdd: id,
      },
      include: [
        {
          model: Task,
        },
      ],
    });

    res.json(post);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/user/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.create({
      userName: username,
      password: await bcrypt.hash(password, 15),
    });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { userName: username } });
    if (!user) {
      res.json("User doesnt exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.json("Invalid Password");
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.destroy({
      where: {
        taskId: id,
      },
    });
    res.json("Task has been deleted");
  } catch (err) {
    console.log(err.message);
  }
});
app.get("/task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({
      where: {
        taskId: id,
      },
    });
    res.json(task);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/api", (req, res) => {
  res.json(tasks);
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
