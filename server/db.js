const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("TodoList", "postgres", "1234", {
  host: "localhost",
  dialect: "postgres",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const User = sequelize.define("user", {
  userName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Todos = sequelize.define("todo", {
  todosId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  todosName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userIdd: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "userId",
    },
  },
});

Todos.belongsTo(User);
User.hasMany(Todos);

const Task = sequelize.define("task", {
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  taskName: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
  todoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Todos,
      key: "todosId",
    },
  },
  taskFinished: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Task.belongsTo(Todos);
Todos.hasMany(Task);

sequelize
  .sync()
  .then(() => {
    console.log("DB SYNCED successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = { sequelize, Task, Todos, User };
