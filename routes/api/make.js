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

// Update name of Make
router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const result = await Make.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
      },
      { new: true }
    );
    res.send(result);
  })
);

// Update specific model
router.put(
  "/:makeId/models/:modelId",
  asyncMiddleware(async (req, res) => {
    const result = await Make.findOneAndUpdate(
      { _id: req.params.makeId, "models._id": req.params.modelId },
      {
        $set: {
          "models.$.name": req.body.name,
        },
      },
      { new: true }
    );
    res.send(result);
  })
);

// Add new model
router.put(
  "/:id/models",
  asyncMiddleware(async (req, res) => {
    const result = await Make.findOneAndUpdate(
      { _id: req.params.id },
      { $addToSet: { models: new Model({ name: req.body.name }) } },
      { new: true }
    );
    res.send(result);
  })
);

// Delete Make
router.delete(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const result = await Make.findByIdAndDelete(req.params.id);
    res.send(result);
  })
);

// Delete specific model
router.delete(
  "/:makeId/models/:modelId",
  asyncMiddleware(async (req, res) => {
    const result = await Make.findOneAndUpdate(
      { _id: req.params.makeId },
      {
        $pull: {
          models: { _id: req.params.modelId },
        },
      },
      { new: true }
    );
    res.send(result);
  })
);
module.exports = router;
