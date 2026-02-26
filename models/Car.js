const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    model: {
        type: String,
        trim: true,
        required: [true, 'Please add a car model']
    },
    brand: {
        type: String,
        required: [true, 'Please add a car brand']
    },
    licensePlate: {
        type: String,
        unique: true,
        required: [true, 'Please add a license plate'],
        maxlength: [10, 'License plate cannot be more than 10 characters']
    },
    priceperday: {
        type: Number,
        required: [true, 'Please add a price per day']
    },
    provider: {
        type: mongoose.Schema.ObjectId,
        ref: 'CarProvider',
        required: [true, 'Please specify the car provider']
    },
    status: {
        type: Boolean,
        default: true   // true = พร้อมโดนจอง, false = โดนจองแล้ว
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Car', carSchema);
