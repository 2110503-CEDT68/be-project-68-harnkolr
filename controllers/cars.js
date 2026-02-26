const Car = require('../models/Car');
const CarProvider = require('../models/CarProvider');

// @desc  Get all cars (optionally under a provider)
// @route GET /api/v1/cars
// @route GET /api/v1/carproviders/:providerId/cars
// @access Public
exports.getCars = async (req, res, next) => {
    try {
        let query;
        if (req.params.providerId) {
            query = Car.find({ provider: req.params.providerId });
        } else {
            query = Car.find();
        }

        query = query.populate({ path: 'provider', select: 'name address tel' });

        const cars = await query;
        res.status(200).json({ success: true, count: cars.length, data: cars });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc  Get single car
// @route GET /api/v1/cars/:id
// @access Public
exports.getCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id).populate({ path: 'provider', select: 'name address tel' });

        if (!car) {
            return res.status(404).json({ success: false, message: `No car with id ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc  Create car under a provider
// @route POST /api/v1/carproviders/:providerId/cars
// @access Private/Admin
exports.createCar = async (req, res, next) => {
    try {
        req.body.provider = req.params.providerId;

        const provider = await CarProvider.findById(req.params.providerId);
        if (!provider) {
            return res.status(404).json({ success: false, message: `No car provider with id ${req.params.providerId}` });
        }

        const car = await Car.create(req.body);
        res.status(201).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc  Update car
// @route PUT /api/v1/cars/:id
// @access Private/Admin
exports.updateCar = async (req, res, next) => {
    try {
        const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!car) {
            return res.status(404).json({ success: false, message: `No car with id ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: car });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc  Delete car
// @route DELETE /api/v1/cars/:id
// @access Private/Admin
exports.deleteCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ success: false, message: `No car with id ${req.params.id}` });
        }

        await car.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
