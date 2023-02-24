const commentRouter = require("express").Router();
const {
  removeComment,
} = require("../controllers/comments.controllers");

commentRouter.delete("/:comment_id", removeComment);

module.exports = commentRouter