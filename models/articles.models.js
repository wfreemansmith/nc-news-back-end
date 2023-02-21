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

module.exports = { selectArticles };
