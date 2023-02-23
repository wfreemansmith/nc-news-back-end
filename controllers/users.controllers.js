const { selectUsers } = require("../models/users.models");

const getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    res.status(200).send({users})
  });
};

module.exports = { getUsers };
