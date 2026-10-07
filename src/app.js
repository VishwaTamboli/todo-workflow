const express = require("express");
const todosRouter = require("./todos");

const app = express();

app.use(express.json());
app.use("/todos", todosRouter);

module.exports = app;
