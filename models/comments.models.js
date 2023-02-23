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

const insertComment = () => {};

const deleteComment = (comment_id) => {
  if (isNaN(comment_id)) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
  return db
    .query(`DELETE FROM comments WHERE comment_id = ${comment_id};`)
    .then(({ rowCount }) => {
      return !rowCount
        ? Promise.reject({ status: 404, msg: "Comment not found" })
        : true;
    });
};

module.exports = { selectCommentsById, insertComment, deleteComment };
