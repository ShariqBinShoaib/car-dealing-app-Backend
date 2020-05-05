const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");

const asyncMiddleware = require("../../middlewares/async");
const Make = require("../../models/Make");
const Model = require("../../models/Model");
const { validateMake } = require("../../models/Make");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const makes = await Make.find();
    res.send(makes);
  })
);

router.post(
  "/add",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    console.log(req.body);
    const models = req.body.models.map(
      (modelName) => new Model({ name: modelName }) // Convert array of string items into array of mongoose object
    );

    const newMake = {
      name: req.body.name,
      models,
    };

    console.log(newMake);

    const { error } = validateMake(newMake);
    if (error) return res.status(400).send(error.details[0].message);

    const make = new Make(newMake);
    const result = await make.save();
    res.send(result);
  })
);

module.exports = router;
