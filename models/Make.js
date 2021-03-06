const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const { modelSchema } = require("./Model");

const makeSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
  },
  models: {
    type: [modelSchema],
    required: true,
    validate: [(val) => val.length > 0, "Make must have atleast one model"],
  },
});

function validateMake(make) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    models: Joi.array().items(
      Joi.object({
        name: Joi.string().max(255).required(),
      })
    ),
  });

  return schema.validate(make, { allowUnknown: true });
}

module.exports = mongoose.model("Make", makeSchema);
module.exports.validateMake = validateMake;
