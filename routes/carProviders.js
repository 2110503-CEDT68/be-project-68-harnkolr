const express = require('express');
const router = express.Router({ mergeParams: true });

const {
    getCarProviders,
    getCarProvider,
    createCarProvider,
    updateCarProvider,
    deleteCarProvider
} = require('../controllers/carProviders');
const { protect, authorize } = require('../middleware/auth');

// Re-route into cars router
const carRouter = require('./cars');
router.use('/:providerId/cars', carRouter);

router.route('/')
    .get(getCarProviders)
    .post(protect, authorize('admin'), createCarProvider);

router.route('/:id')
    .get(getCarProvider)
    .put(protect, authorize('admin'), updateCarProvider)
    .delete(protect, authorize('admin'), deleteCarProvider);

module.exports = router;
