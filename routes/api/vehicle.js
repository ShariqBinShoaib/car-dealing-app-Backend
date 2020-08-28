const express = require("express");
const fs = require("fs");
const router = express.Router();
const isEmpty = require("../../helpers/isEmpty");

const auth = require("../../middlewares/auth");

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
    if (isEmpty(vehicles)) return res.status(404).send("No vehicle found");
    res.send(vehicles);
  })
);

router.get(
  "/loggedin-user",
  auth,
  asyncMiddleware(async (req, res) => {
    const vehicles = await Vehicle.find({ user: req.user.id });
    if (isEmpty(vehicles)) return res.status(404).send("No vehicle found.");
    res.send(vehicles);
  })
);

router.post(
  "/add",
  auth,
  asyncMiddleware(async (req, res) => {
    singleImageUploader(req, res, async (err) => {
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
        user: req.user.id,
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
  auth,
  asyncMiddleware(async (req, res) => {
    multipleImagesUploader(req, res, async (err) => {
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

router.delete(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(400).send("Already Deleted");

    const result = await Vehicle.deleteOne({ _id: req.params.id });

    removeFile(vehicle.vehicleDp.path);
    vehicle.vehicleImages.forEach((image) => removeFile(image.path));

    res.send(result);
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
