const express = require("express");
const { getTopics } = require("./controllers/topics.controllers.js");
const { getArticles, getCommentsById } = require("./controllers/articles.controllers");
const {
  internalErrorHandler,
  pathNotFoundHandler,
} = require("./controllers/error-handling.controllers.js");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsById)

app.use(pathNotFoundHandler);
app.use(internalErrorHandler);

module.exports = app;
