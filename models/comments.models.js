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
    .then(({ rows }) => {
      return !rows.length
        ? Promise.reject({ status: 404, msg: "Article not found" })
        : rows;
    });
};

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

const insertComment = (commentObj, { article_id }) => {
  const { body, username } = commentObj;

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }

  if (typeof body !== "string" || typeof username !== "string") {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }

  return db
    .query(
      `
            INSERT INTO comments
              (body, article_id, author)
            VALUES
              ($1, $2, $3)
            RETURNING *;
           `,
      [body, article_id, username]
    )
    .then((response) => {
      return response.rows[0];
    });
};
module.exports = { selectCommentsById, insertComment, deleteComment };
