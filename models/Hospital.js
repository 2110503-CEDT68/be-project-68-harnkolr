const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
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
        required: [true, 'Please add telephone number']
    },


    model: {
        type: String,
        trim: true,
        required: [true, 'Please add car model']
    },
    brand: {
        type: String,
        required: [true, 'Please add car brand']
    },
    licensePlate: {
        type: String,
        unique:true,
        required: [true, 'Please add car licensePlate'],
        maxlength: [6, 'car licensePlate cannot be more than 6 characters']

        
    },
    priceperday: {
        type: Number,
        required: [true, 'Please add Priceperday']
    }
}, {
    
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('car_provider', providerSchema);