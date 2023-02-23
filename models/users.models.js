const db = require("../db/connection.js");

const selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({rows}) => {
    return rows;
  })
};

module.exports = { selectUsers };
