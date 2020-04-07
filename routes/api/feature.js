const express = require("express");
const router = express.Router();

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
  asyncMiddleware(async (req, res) => {
    const { error } = validateFeature(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const feature = new Feature(req.body);
    const result = await feature.save();
    res.send(result);
  })
);

module.exports = router;
