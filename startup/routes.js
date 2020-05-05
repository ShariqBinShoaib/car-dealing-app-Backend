const express = require("express");

const auth = require("../routes/api/auth");
const users = require("../routes/api/user");
const makes = require("../routes/api/make");
const features = require("../routes/api/feature");
const vehicles = require("../routes/api/vehicle");
const error = require("../middlewares/error");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("./public"));
  app.use("/api/vehicles", vehicles);
  app.use("/api/features", features);
  app.use("/api/makes", makes);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
