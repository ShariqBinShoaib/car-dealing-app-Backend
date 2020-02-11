const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('@hapi/joi');

const featureSchema = new Schema({
    name: {
        type: String,
        maxlength: 255,
        required: true
    }
});

const validateFeature = function (feature) {
    const schema = Joi.object({
        name: Joi.string().max(255).required()
    });

    return schema.validate(feature)
}

module.exports = mongoose.model('Feature', featureSchema);
module.exports.featureSchema = featureSchema;
module.exports.validateFeature = validateFeature;