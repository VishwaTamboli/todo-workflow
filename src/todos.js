const express = require("express");

const router = express.Router();

const todos = [];
let nextId = 1;

const ALLOWED_PRIORITIES = ["low", "medium", "high"];

function isValidPriority(value) {
  return typeof value === "string" && ALLOWED_PRIORITIES.includes(value);
}

router.get("/", (req, res) => {
  res.status(200).json(todos);
});

router.get("/metrics", (req, res) => {
  const byPriority = { low: 0, medium: 0, high: 0 };
  let completed = 0;

  for (const todo of todos) {
    if (todo.completed) {
      completed += 1;
    }
    if (isValidPriority(todo.priority)) {
      byPriority[todo.priority] += 1;
    }
  }

  res.status(200).json({
    total: todos.length,
    completed,
    incomplete: todos.length - completed,
    byPriority,
  });
});

router.get("/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }

  res.status(200).json(todo);
});

router.post("/", (req, res) => {
  const { title, priority } = req.body || {};

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }

  if (priority !== undefined && !isValidPriority(priority)) {
    return res.status(400).json({ error: "priority must be low, medium, or high" });
  }

  const todo = {
    id: nextId++,
    title,
    completed: false,
    priority: priority === undefined ? "medium" : priority,
  };

  todos.push(todo);
  res.status(201).json(todo);
});

router.patch("/:id", (req, res) => {
  const todo = todos.find((t) => t.id === Number(req.params.id));

  if (!todo) {
    return res.status(404).json({ error: "todo not found" });
  }

  const { title, completed, priority } = req.body || {};

  if (priority !== undefined && !isValidPriority(priority)) {
    return res.status(400).json({ error: "priority must be low, medium, or high" });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }
    todo.title = title;
  }

  if (completed !== undefined) {
    todo.completed = Boolean(completed);
  }

  if (priority !== undefined) {
    todo.priority = priority;
  }

  res.status(200).json(todo);
});

module.exports = router;
module.exports._reset = () => {
  todos.length = 0;
  nextId = 1;
};
