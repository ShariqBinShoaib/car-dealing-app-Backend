const express = require('express');
const router = express.Router()

const asyncMiddleware = require('../../middlewares/async');
const Make = require("../../models/Make");
const Model = require("../../models/Model");
const { validateMake } = require('../../models/Make');

router.get('/', async (req, res) => {
    const makes = await Make.find();
    res.send(makes);
});

router.post('/add', asyncMiddleware(async (req, res) => {
    console.log(req.body);
    const newModels = [];
    req.body.models.forEach(element => {
        newModels.push(new Model({ name: element }));
    });

    const newMake = {
        name: req.body.name,
        models: newModels
    };

    console.log(newMake);

    const { error } = validateMake(newMake);
    if (error) return res.status(400).send(error.details[0].message);

    const make = new Make(newMake);
    const result = await make.save();
    res.send(result);
}));

module.exports = router;