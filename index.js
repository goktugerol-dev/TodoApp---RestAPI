const express = require("express");
const bodyParser = require("body-parser");
const uuid = require("uuid");

const app = express();

app.use(bodyParser.json());

const todos = {};

// Retrieve all todos for all users
app.get("/api/todos", (req, res) => {
  const allTodos = Object.values(todos).flat();
  res.json(allTodos);
});

app.get("/api/todos/:userId", (req, res) => {
  const { userId } = req.params;

  if (!todos[userId]) {
    todos[userId] = [];
  }

  res.json(todos[userId]);
});

// Add a new todo
app.post("/api/todos/:userId", (req, res) => {
  const { userId } = req.params;
  const {
    title,
    description,
    completionStatus,
    deliveryDate,
    comments,
    responsible,
    tags,
  } = req.body;
  const id = uuid.v4();

  const todo = {
    id,
    title,
    description,
    completionStatus: false,
    deliveryDate,
    comments,
    responsible,
    tags,
  };

  if (!todos[userId]) {
    todos[userId] = [];
  }

  todos[userId].push(todo);

  res.json(todo);
});

// Update a todo
app.put("/api/todos/:userId/:todoId", (req, res) => {
  const { userId, todoId } = req.params;
  const {
    title,
    description,
    completionStatus,
    deliveryDate,
    comments,
    responsible,
    tags,
  } = req.body;

  const todo = todos[userId].find((t) => t.id === todoId);

  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  todo.title = title;
  todo.description = description;
  todo.completionStatus = completionStatus;
  todo.deliveryDate = deliveryDate;
  todo.comments = comments;
  todo.responsible = responsible;
  todo.tags = tags;

  res.json(todo);
});

// Delete a todo
app.delete("/api/todos/:userId/:todoId", (req, res) => {
  const { userId, todoId } = req.params;

  todos[userId] = todos[userId].filter((t) => t.id !== todoId);

  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
