const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex');

mongoose.connect('mongodb://localhost/karby', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// const modelSchema = new Schema({
//     name: {
//         type: String,
//         maxlength: 255,
//         required: true
//     }
// });

// const Model = mongoose.model("Model", modelSchema);

// const makeSchema = new Schema({
//     name: {
//         type: String,
//         required: true,
//         maxlength: 255
//     },
//     models: {
//         type: [modelSchema],
//         required: true
//     }
// });

// const Make = mongoose.model("Make", makeSchema);


// const newMake = {
//     name: "Honda",
//     models: ["City", "Civic", "Accord"]
// };

// async function createMake(newMake) {
//     const models = [];
//     newMake.models.forEach(element => {
//         models.push(new Model({ name: element }));
//     });
//     const make = new Make({
//         name: newMake.name,
//         models
//     });
//     const result = await make.save();
//     console.log(result);
// }

// createMake(newMake);

const Make = require('./models/Make');

const Feature = require('./models/Feature');
const { validateFeature } = require('./models/Feature');

const Vehicle = require('./models/Vehicle');
const { validateVehicle } = require('./models/Vehicle');

async function dropCollection(model) {
    try {
        result = await model.collection.drop();
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

// dropCollection(Vehicle);


// const newFeature = {
//     name: 'feature 3'
// };

const newVehicle = {
    makeId: '5e06780d4ae8832e1c818a3d',
    modelId: '5e06780d4ae8832e1c818a3a',
    year: '2019',
    featuresId: ['5e4986e6726a4322f4e547ca', '5e498706676a0843c0dd674a'],
    isRegistered: true,
    contactName: 'User',
    contactPhone: '03XX-XXXXXXX',
    contactEmail: 'user@domain.com',
    vehicleDp: {
        mimetype: 'Image/jpg',
        destination: 'root',
        filename: 'abc.jpg',
        path: 'root'
    },
    vehicleImages: [
        {
            mimetype: 'Image/jpg',
            destination: 'root',
            filename: 'xyz.jpg',
            path: 'root'
        },
        {
            mimetype: 'Image/jpg',
            destination: 'root',
            filename: '123.jpg',
            path: 'root'
        }
    ]
};

async function createVehicle(request) {
    try {
        const make = await Make.findById(request.makeId);
        if (!make) return console.log('Make not found!');

        const model = make.models.find(model => model._id == request.modelId);
        if (!model) return console.log('Model not found!');


        const features = await Feature.find();
        if (!features) return console.log('No feature found!');

        const vehicleFeatures = features.filter(feature => request.featuresId.includes(feature._id.toString()));
        if (!vehicleFeatures) return console.log('No feature found');

        const newVehicle = {
            make: {
                _id: make._id,
                name: make.name
            },
            model,
            year: request.year,
            features: vehicleFeatures,
            isRegistered: request.isRegistered,
            contactName: request.contactName,
            contactPhone: request.contactPhone,
            contactEmail: request.contactEmail,
            vehicleDp: request.vehicleDp,
            // vehicleImages: request.vehicleImages
        }

        console.log(newVehicle);
        console.log('\n\n');

        const { error } = validateVehicle(newVehicle);
        if (error) return console.log(error.details[0].message);

        const vehicle = new Vehicle(newVehicle);
        const result = await vehicle.save();
        console.log(result);
    } catch (err) {
        console.log(err.errors);
    }
}

async function createFeature(newFeature) {
    const { error } = validateFeature(newFeature);
    if (error) return console.log(error.details[0].message);

    const feature = new Feature(newFeature);
    const result = await feature.save();
    console.log(result);
}

createVehicle(newVehicle);
// createFeature(newFeature);