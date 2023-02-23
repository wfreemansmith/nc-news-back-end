const app = require("../app");
const {
  insertComment,
  selectCommentsById,
} = require("../models/comments.models");

const getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsById(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  const { body, params } = req;
  insertComment(body, params)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getCommentsById, postComment };
