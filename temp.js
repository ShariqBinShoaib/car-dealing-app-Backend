const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex');

mongoose.connect('mongodb://localhost/karby', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const modelSchema = new Schema({
    name: {
        type: String,
        maxlength: 255,
        required: true
    }
});

const Model = mongoose.model("Model", modelSchema);

const makeSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 255
    },
    models: {
        type: [modelSchema],
        required: true
    }
});

const Make = mongoose.model("Make", makeSchema);


const newMake = {
    name: "Honda",
    models: ["City", "Civic", "Accord"]
};

async function createMake(newMake) {
    const models = [];
    newMake.models.forEach(element => {
        models.push(new Model({ name: element }));
    });
    const make = new Make({
        name: newMake.name,
        models
    });
    const result = await make.save();
    console.log(result);
}

createMake(newMake);