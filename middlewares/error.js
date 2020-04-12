module.exports = function (err, req, res, next) {
  console.log("Error Middleware: ", err);
  res.status(500).send("Something Failed");
};
