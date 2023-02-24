const express = require("express");

const { getTopics } = require("./controllers/topics.controllers");

const {
  getArticles,
  getArticleById,
  patchVote,
} = require("./controllers/articles.controllers");

const {
  getCommentsById,
  postComment,
} = require("./controllers/comments.controllers");

const {
  internalErrorHandler,
  pathNotFoundHandler,
  customErrorHandler,
  dbErrorHandler,
} = require("./controllers/error-handling.controllers.js");

const { getUsers } = require("./controllers/users.controllers");

const { getEndpoints } = require("./controllers/endpoints.controller.js")

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.get("/api/users", getUsers);
app.get("/api", getEndpoints)

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVote);

app.use(pathNotFoundHandler);
app.use(customErrorHandler);
app.use(dbErrorHandler);
app.use(internalErrorHandler);

module.exports = app;
