const pathNotFoundHandler = (req, res, next) => {
  res.status(404).send({msg: "Path not found"});
}

const internalErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal error" });
};

module.exports = { internalErrorHandler, pathNotFoundHandler };