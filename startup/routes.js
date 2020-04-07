const express = require("express");

const makes = require("../routes/api/make");
const features = require("../routes/api/feature");
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/features", features);
  app.use("/api/makes", makes);
  app.use(error);
};
