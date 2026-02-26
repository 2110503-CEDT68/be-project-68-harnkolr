const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    appDate: {
        type: Date,
        required: [true, 'Please add a booking date']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: mongoose.Schema.ObjectId,
        ref: 'Car',
        required: [true, 'Please specify a car']
    },
    status: {
        type: Boolean,
        default: false  // false = currently renting, true = returned/completed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);