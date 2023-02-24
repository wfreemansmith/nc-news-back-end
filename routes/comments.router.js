const commentRouter = require("express").Router();
const {
  removeComment, patchCommentVote
} = require("../controllers/comments.controllers");

commentRouter.delete("/:comment_id", removeComment);
commentRouter.patch("/:comment_id", patchCommentVote)

module.exports = commentRouter