const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const jwt = require("jsonwebtoken");
// const config = require("config");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    minlength: 3,
    maxlength: 15,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, name: this.name, isAdmin: this.isAdmin },
    //   config.get("jwtPrivateKey")
    "jwtPrivateKey",
    { expiresIn: "1d" }
  );
  return token;
};

const validateUser = function (user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().max(255).required(),
    phone: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
};

module.exports = mongoose.model("User", userSchema);
module.exports.validateUser = validateUser;
