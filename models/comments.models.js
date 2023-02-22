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

const insertComment = (commentObj, {article_id}) => {
  const { username, body } = commentObj;

  return db.query(
    `
            INSERT INTO comments
              (body, article_id, author)
            VALUES
              ($1, $2, $3)
            RETURNING *;
            `,
    [body, article_id, username]
  ).then(({rows}) => {
    return rows[0];
  });
};

module.exports = { selectCommentsById, insertComment };
