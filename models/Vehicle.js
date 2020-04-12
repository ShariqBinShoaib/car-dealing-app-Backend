const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("@hapi/joi");

const { featureSchema } = require("./Feature");

const vehicleSchema = new Schema({
  make: {
    type: new Schema({
      name: {
        type: String,
        maxlength: 255,
        required: true,
      },
    }),
    required: true,
  },
  model: {
    type: new Schema({
      name: {
        type: String,
        maxlength: 255,
        required: true,
      },
    }),
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  features: {
    type: [featureSchema],
    required: true,
    validate: [
      (val) => val.length > 0,
      "Vehicle must have atleast one feature",
    ],
  },
  isRegistered: {
    type: Boolean,
    required: true,
  },
  contactName: {
    type: String,
    maxlength: 255,
    required: true,
  },
  contactPhone: {
    type: String,
    maxlength: 255,
    required: true,
  },
  contactEmail: {
    type: String,
    maxlength: 255,
    required: true,
  },
  vehicleDp: {
    type: {
      destination: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  vehicleImages: [
    {
      destination: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
  ],
});

const validateVehicle = function (vehicle) {
  const schema = Joi.object({
    make: Joi.object({
      name: Joi.string().max(255).required(),
    }),
    model: Joi.object({
      name: Joi.string().max(255).required(),
    }),
    features: Joi.array().items(
      Joi.object({
        name: Joi.string().max(255).required(),
      }).required()
    ),
    isRegistered: Joi.bool().required(),
    contactName: Joi.string().max(255).required(),
    contactPhone: Joi.string().max(255).required(),
    contactEmail: Joi.string().max(255).required(),
    vehicleDp: Joi.object().required(),
    vehicleImages: Joi.array(),
  });

  return schema.validate(vehicle, { allowUnknown: true });
};

module.exports = mongoose.model("Vehicle", vehicleSchema);
module.exports.validateVehicle = validateVehicle;
