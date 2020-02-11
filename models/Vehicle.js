const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { featureSchema } = require('./Feature');

const vehicleSchema = new Schema({
    make: {
        type: new Schema({
            name: {
                type: String,
                maxlength: 255,
                required: true
            }
        }),
        required: true
    },
    model: {
        type: new Schema({
            name: {
                type: String,
                maxlength: 255,
                required: true
            }
        }),
        required: true
    },
    features: {
        type: [featureSchema],
        required: true
    },
    isRegistered: {
        type: Boolean,
        required: true
    },
    contactName: {
        type: String,
        maxlength: 255,
        required: true
    },
    contactPhone: {
        type: String,
        maxlength: 255,
        required: true
    },
    contactEmail: {
        type: String,
        maxlength: 255,
        required: true
    }
});