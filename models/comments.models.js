const db = require("../db/connection.js");

const insertComment = (commentObj, article_id) => {
  const { username, body } = commentObj;

  db.query(
    `
            INSERT INTO comments
              (body, article_id, author)
            VALUES
              ($1, $2, $3)
            RETURNING *;
            `,
    [body, article_id, username]
  ).then((response) => {
    console.log(response);
  });
};

module.exports = { insertComment };
