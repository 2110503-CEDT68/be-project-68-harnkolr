const mongoose = require('mongoose');

const carProviderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a provider name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a district']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postal code']
    },
    region: {
        type: String,
        required: [true, 'Please add a region']
    },
    tel: {
        type: String,
        required: [true, 'Please add a telephone number']
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

carProviderSchema.virtual('cars', {
    ref: 'Car',
    localField: '_id',
    foreignField: 'provider',
    justOne: false
});

module.exports = mongoose.model('CarProvider', carProviderSchema);
