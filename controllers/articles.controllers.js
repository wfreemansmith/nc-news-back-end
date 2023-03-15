const {
  selectArticles,
  selectArticleById,
  selectCommentsById,
  insertComment,
  updateVote,
  checkTopic,
  checkAuthor
} = require("../models/articles.models");

const getArticles = (req, res, next) => {
  const { topic, sort_by, order, author } = req.query;

  const promise1 = selectArticles(topic, sort_by, order, author);
  const promise2 = topic ? checkTopic(topic) : "";
  const promise3 = author ? checkAuthor(author) : "";

  Promise.all([promise1, promise2, promise3])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

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

const patchVote = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateVote(inc_votes, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticles, getArticleById, getCommentsById, postComment, patchVote };
