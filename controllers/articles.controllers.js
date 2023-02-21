const {
  selectArticles,
  selectCommentsById,
} = require("../models/articles.models");

const getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsById(article_id)
    .then((comments) => {
      console.log(comments)
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticles, getCommentsById };
