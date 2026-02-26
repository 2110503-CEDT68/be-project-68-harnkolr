const Appointment = require('../models/Appointment');
const Car = require('../models/Car');

// @desc  Get all appointments
// @route GET /api/v1/appointments
// @access Private
exports.getAppointments = async (req, res, next) => {
    try {
        let query;

        if (req.user.role !== 'admin') {
            // Regular user — only see their own
            query = Appointment.find({ user: req.user.id });
        } else {
            // Admin — see all
            query = Appointment.find();
        }

        query = query.populate({
            path: 'car',
            select: 'brand model licensePlate priceperday',
            populate: { path: 'provider', select: 'name address tel' }
        });

        const appointments = await query;
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: 'Cannot find appointments' });
    }
};

// @desc  Get single appointment
// @route GET /api/v1/appointments/:id
// @access Private
exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path: 'car',
            select: 'brand model licensePlate priceperday',
            populate: { path: 'provider', select: 'name address tel' }
        });

        if (!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with id ${req.params.id}` });
        }

        // Non-admin can only view their own
        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to view this appointment' });
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: 'Cannot find appointment' });
    }
};

// @desc  Create appointment
// @route POST /api/v1/appointments
// @access Private
exports.addAppointment = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        // Check that the selected car exists and is available
        const car = await Car.findById(req.body.car);
        if (!car) {
            return res.status(404).json({ success: false, message: `No car with id ${req.body.car}` });
        }
        if (!car.status) {
            return res.status(400).json({ success: false, message: 'This car is currently unavailable' });
        }

        // Enforce 3-booking limit for regular users:
        // Count only appointments where status = false (still renting / not yet returned)
        if (req.user.role !== 'admin') {
            const activeAppointments = await Appointment.find({
                user: req.user.id,
                status: false   // false = currently renting
            });

            if (activeAppointments.length >= 3) {
                return res.status(400).json({
                    success: false,
                    message: `User ${req.user.id} already has 3 active bookings. Please return a car before making a new booking.`
                });
            }
        }

        const appointment = await Appointment.create(req.body);
        res.status(201).json({ success: true, data: appointment });
    } catch (err) {
        console.log('ERROR:', err);
        return res.status(500).json({ success: false, message: 'Cannot create appointment' });
    }
};

// @desc  Update appointment
// @route PUT /api/v1/appointments/:id
// @access Private
exports.updateAppointment = async (req, res, next) => {
    try {
        let appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with id ${req.params.id}` });
        }

        // Non-admin can only edit their own
        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update this appointment` });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: appointment });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: 'Cannot update appointment' });
    }
};

// @desc  Delete appointment
// @route DELETE /api/v1/appointments/:id
// @access Private
exports.deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ success: false, message: `No appointment with id ${req.params.id}` });
        }

        // Non-admin can only delete their own
        if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this appointment`
            });
        }

        await appointment.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ success: false, message: 'Cannot delete appointment' });
    }
};
