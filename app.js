const express = require("express");
const { getTopics } = require("./controllers/topics.controllers.js");
const { getArticles } = require("./controllers/articles.controllers");
const {
  internalErrorHandler,
} = require("./controllers/error-handling.controllers.js");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

// custom errors above this
app.use(internalErrorHandler);

module.exports = app;
