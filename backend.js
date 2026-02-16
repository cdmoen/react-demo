const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // 24 hours
  }),
);

app.use(express.json());

// In-memory storage
const users = {};
const todos = {};

const extractToken = (authHeader) => {
  if (!authHeader) return null;
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
};

const findUserByToken = (token) =>
  Object.values(users).find((u) => u.token === token);

const authenticateUser = (req, res, next) => {
  const token = extractToken(req.headers.authorization);

  if (!token || !findUserByToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (users[username]) {
    return res.status(400).json({ error: "Username already exists" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  users[username] = {
    username,
    password,
    token,
    id: Object.keys(users).length + 1,
  };

  todos[username] = [];

  res.status(201).json({
    id: users[username].id,
    username,
    token,
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    id: user.id,
    username,
    token: user.token,
  });
});

app.post("/logout", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);

  if (user) {
    // Generate a new token to invalidate the old one
    user.token = crypto.randomBytes(32).toString("hex");
    res.json({ message: "Logged out successfully" });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/todos", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  const { title, description } = req.body;

  const newTodo = {
    id: crypto.randomBytes(16).toString("hex"),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos[user.username].push(newTodo);
  res.status(201).json(newTodo);
});

app.get("/todos", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  res.json(todos[user.username]);
});

app.put("/todos/:id", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  const todoId = req.params.id;
  const { title, description, completed } = req.body;

  const todoToUpdate = todos[user.username].find((todo) => todo.id === todoId);

  if (!todoToUpdate) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todoToUpdate.title = title || todoToUpdate.title;
  todoToUpdate.description = description || todoToUpdate.description;
  todoToUpdate.completed =
    completed !== undefined ? completed : todoToUpdate.completed;

  res.json(todoToUpdate);
});

app.delete("/todos/:id", authenticateUser, (req, res) => {
  const token = extractToken(req.headers.authorization);
  const user = findUserByToken(token);
  const todoId = req.params.id;

  const todoIndex = todos[user.username].findIndex(
    (todo) => todo.id === todoId,
  );

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos[user.username].splice(todoIndex, 1);
  res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
