const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

const auth = require("../../middlewares/auth");
const asyncMiddleware = require("../../middlewares/async");
const User = require("../../models/User");
const { validateUser } = require("../../models/User");

router.get(
  "/me",
  auth,
  asyncMiddleware(async (req, res) => {
    const user = User.findById(req.user.id).select("-password");
    res.send(user);
  })
);

router.post(
  "/add",
  asyncMiddleware(async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered!");

    const salt = await bcrypt.genSalt(10);
    const hashedPasword = await bcrypt.hash(req.body.password, salt);

    const newUser = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPasword,
    };

    user = new User(newUser);
    const result = await user.save();
    res.send(_.pick(result, ["_id", "name", "email", "phone"]));
  })
);

module.exports = router;
