const mongoose = require('mongoose');

module.exports = function () {
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex');

    mongoose.connect('mongodb://localhost/karby', { useNewUrlParser: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB...', err));
}