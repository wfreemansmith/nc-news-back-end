const articleRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsById,
  postComment,
  patchVote,
} = require("../controllers/articles.controllers");

articleRouter.get("/", getArticles);
articleRouter.get("/:article_id", getArticleById);
articleRouter.get("/:article_id/comments", getCommentsById);
articleRouter.post("/:article_id/comments", postComment);
articleRouter.patch("/:article_id", patchVote);

module.exports = articleRouter