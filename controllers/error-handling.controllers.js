const pathNotFoundHandler = (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
};

const customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else next(err);
};

const dbErrorHandler = (err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "23503") {
    let contentType = "Record"
    if (/articles/g.test(err.detail)) contentType = "Article";
    if (/users/g.test(err.detail)) contentType = "User";
    res.status(404).send({ msg: `${contentType} not found` });
  } else {
    next(err);
  }
};

const internalErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal error" });
};

module.exports = {
  internalErrorHandler,
  pathNotFoundHandler,
  customErrorHandler,
  dbErrorHandler };