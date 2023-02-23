const db = require("../db/connection.js");

const selectArticles = (topic, sort_by = "created_at", order = "desc") => {
  const sortbyWhitelist = ["title", "topic", "author", "body", "created_at"];

  if (!sortbyWhitelist.includes(sort_by.toLocaleLowerCase())) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let topicQuery = ``;
  const queryValues = [];

  if (topic) {
    topicQuery = `WHERE topic = $1 `;
    queryValues.push(topic);
  }

  return db
    .query(
      `
        SELECT articles.*,
        COUNT(comments.article_id) AS comment_count FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        ${topicQuery}
        GROUP BY articles.article_id
        ORDER by ${sort_by} ${order};
        `,
      queryValues
    )
    .then(({ rows }) => {
      rows.forEach((row) => {
        row.comment_count *= 1;
      });
      return rows;
    });
};

const checkTopic = (topic) => {
  return db
    .query(
      `
      SELECT * FROM topics
      WHERE slug = $1
      `,
      [topic]
    )
    .then(({ rowCount }) => {
      return !rowCount
        ? Promise.reject({ status: 404, msg: "Topic not found" })
        : true;
    });
};

const selectArticleById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
  return db
    .query(
      `
      SELECT articles.*,
      COUNT(comments.article_id) AS comment_count FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id=$1
      GROUP BY articles.article_id;
      `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        const result = rows[0];
        result.comment_count *= 1;
        return result;
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
    .then(({ rows }) => {
      return !rows.length
        ? Promise.reject({ status: 404, msg: "Article not found" })
        : rows[0];
    });
};

module.exports = { selectArticles, selectArticleById, updateVote, checkTopic };
