const express = require("express");
const router = express.Router();

const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");

const asyncMiddleware = require("../../middlewares/async");
const Feature = require("../../models/Feature");
const { validateFeature } = require("../../models/Feature");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const features = await Feature.find();
    res.send(features);
  })
);

router.post(
  "/add",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const { error } = validateFeature(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const feature = new Feature(req.body);
    const result = await feature.save();
    res.send(result);
  })
);

router.put(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const result = await Feature.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
    });
    res.send(result);
  })
);
router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const result = await Feature.findByIdAndDelete(req.params.id);
    res.send(result);
  })
);

module.exports = router;
