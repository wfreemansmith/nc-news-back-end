const app = require("../app");
const { insertComment } = require("../models/comments.models");

const postComment = (req, res, next) => {
  const {body, params} = req
  insertComment(body, params).then((comment) => {
    res.status(201).send({ comment });
  });
};

module.exports = { postComment };
