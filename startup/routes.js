const express = require('express');
const bodyparser = require('body-parser');

const makes = require('../routes/api/make');
const error = require('../middlewares/error').default;

module.exports = function (app) {
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use('/api/makes', makes);
    app.use(error);
};