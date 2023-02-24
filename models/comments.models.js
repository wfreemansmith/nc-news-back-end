const db = require("../db/connection.js");

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

module.exports = { deleteComment };