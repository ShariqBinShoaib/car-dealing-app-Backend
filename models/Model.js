const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const modelSchema = new Schema({
    name: {
        type: String,
        maxlength: 255,
        required: true
    }
});

module.exports = mongoose.model('Model', modelSchema);
module.exports.modelSchema = modelSchema;