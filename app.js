const express = require("express");

const topicRouter = require("./routes/topics.router");
const userRouter = require("./routes/users.router");
const articleRouter = require("./routes/articles.router");
const commentRouter = require("./routes/comments.router");
const apiRouter = require("./routes/api.router");

const {
  internalErrorHandler,
  pathNotFoundHandler,
  customErrorHandler,
  dbErrorHandler,
} = require("./controllers/error-handling.controllers.js");

const app = express();
app.use(express.json());

app.use("/api/topics", topicRouter);
app.use("/api/users", userRouter);
app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);
app.use("/api", apiRouter);

app.use(pathNotFoundHandler);
app.use(customErrorHandler);
app.use(dbErrorHandler);
app.use(internalErrorHandler);

module.exports = app;
