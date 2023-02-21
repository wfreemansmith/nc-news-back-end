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
  return db
    .query(
      `SELECT * FROM articles
  WHERE article_id=$1`,
      [article_id]
    )
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Record doesn't exist" });
      }
      return response.rows[0];
    });
};

module.exports = { selectArticles, selectArticleById };
