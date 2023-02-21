const db = require("../db/connection.js");

const selectCommentsById = (article_id) => {
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }

  return db
    .query(
      `
          SELECT * FROM comments
          WHERE article_id=$1
          ORDER BY created_at DESC
          `,
      [article_id]
    )
    .then((response) => {
      if (!response.rowCount) {
        return Promise.reject({ status: 404, msg: "No results found" });
      } else {
        return response.rows;
      }
    });
};

module.exports = { selectCommentsById, insertComment };