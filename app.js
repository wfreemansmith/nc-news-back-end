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
} = require("./controllers/error-handling.controllers.js");

const app = express();
app.use(express.json())

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchVote)

app.use(pathNotFoundHandler);
app.use(customErrorHandler);
app.use(internalErrorHandler);

module.exports = app;
