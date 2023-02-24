const app = require("../app");
const { deleteComment, updateCommentVote } = require("../models/comments.models");

const removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

const patchCommentVote = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  updateCommentVote(inc_votes, comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { removeComment, patchCommentVote };
