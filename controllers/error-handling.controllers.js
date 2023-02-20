const internalErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal error" });
};

module.exports = { internalErrorHandler };
