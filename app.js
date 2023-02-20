const express = require("express");
const { getTopics } = require("./controllers/topics.controllers.js")
const { internalErrorHandler } = require("./controllers/error-handling.controllers.js")

const app = express();

app.get("/api/topics", getTopics)

// custom errors above this
app.use(internalErrorHandler)

module.exports = app