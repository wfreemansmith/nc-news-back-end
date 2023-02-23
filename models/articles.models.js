const db = require("../db/connection.js");

const selectArticles = () => {
  return db
    .query(
      `
      SELECT articles.*,
      COUNT(comments.article_id) AS comment_count FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER by articles.created_at DESC;
      `
    )
    .then(({ rows }) => {
      rows.forEach((row) => {
        row.comment_count *= 1;
      });
      return rows;
    });
};

const selectArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
  return db
    .query(
      `SELECT * FROM articles
    WHERE article_id=$1`,
      [article_id]
    )
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "No results found" });
      } else {
        return response.rows[0];
      }
    });
};

const updateVote = (newVote, article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }

  if (isNaN(newVote)) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  return db
    .query(
      `UPDATE articles
       SET votes = votes + $1
       WHERE article_id = $2
       RETURNING *;`,
      [newVote, article_id]
    )
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      } else {
        return response.rows[0];
      }
    });
};

module.exports = { selectArticles, selectArticleById, updateVote };