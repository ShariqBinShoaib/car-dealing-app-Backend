const express = require("express");
const { parse } = require("querystring");
const fs = require("fs");
const router = express.Router();

const Make = require("../../models/Make");
const Feature = require("../../models/Feature");

const Vehicle = require("../../models/Vehicle");
const { validateVehicle } = require("../../models/Vehicle");

const asyncMiddleware = require("../../middlewares/async");
const { singleImageUploader } = require("../../helpers/imagesUploader");
const multipleImagesUploader = require("../../helpers/imagesUploader");

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const vehicles = await Vehicle.find();
    res.send(vehicles);
  })
);

router.post(
  "/add",
  asyncMiddleware(async (req, res) => {
    singleImageUploader(req, res, async (err) => {
      console.log(req.body);
      const make = await Make.findById(req.body.makeId);
      if (!make) {
        removeFile(req.file.path);
        return res.status(400).send("Make not found!");
      }

      const model = make.models.find((model) => model._id == req.body.modelId);
      if (!model) {
        removeFile(req.file.path);
        return res.status(400).send("Model not found!");
      }

      const features = await Feature.find()
        .where("_id")
        .in(req.body.featuresId)
        .exec();
      if (!features) {
        removeFile(req.file.path);
        return res.status(400).send("No feature found!");
      }
      console.log(features);
      //   const vehicleFeatures = features.filter((feature) =>
      //     req.body.featuresId.includes(feature._id.toString())
      //   );
      //   if (!vehicleFeatures) {
      //     removeFile(req.file.path);
      //     return res.status(400).send("No feature found");
      //   }

      if (err) return res.status(400).send(err);
      if (!req.file) return res.status(400).send("Error: No file selected");

      const newVehicle = {
        make: {
          _id: make._id,
          name: make.name,
        },
        model,
        year: req.body.year,
        features: features,
        isRegistered: req.body.isRegistered,
        contactName: req.body.contactName,
        contactPhone: req.body.contactPhone,
        contactEmail: req.body.contactEmail,
        vehicleDp: {
          destination: req.file.destination,
          filename: req.file.filename,
          path: req.file.path,
        },
      };

      //   console.log(req.file);
      //   console.log(newVehicle);
      //   console.log("\n");

      const { error } = validateVehicle(newVehicle);
      if (error) {
        removeFile(req.file.path);
        return console.log(error.details[0].message);
      }

      const vehicle = new Vehicle(newVehicle);
      const result = await vehicle.save();
      //   console.log(result);
      res.send(result);
    });
  })
);

router.put(
  "/:id",
  asyncMiddleware(async (req, res) => {
    multipleImagesUploader(req, res, (err) => {
      if (err) return res.status(400).send(err);
      if (!req.files) return res.status(400).send("Error: No file selected");

      const images = req.files.map((file) => ({
        destination: file.destination,
        filename: file.filename,
        path: file.path,
      }));

      await Vehicle.findOneAndUpdate(
        { _id: req.params.id },
        { vehicleImages: images },
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(400).send("Vehicle does not exist");
          }
          res.send(result);
        }
      );

    });
  })
);

module.exports = router;

function removeFile(path) {
  fs.unlink(path, (err) => {
    if (err && err.code == "ENOENT") {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      console.info(`removed`);
    }
  });
}
