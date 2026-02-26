const Appointment = require('../models/Appointment');
const CarProvider = require('../models/CarProvider');

// @desc  Get all car providers
// @route GET /api/v1/carproviders
// @access Public
exports.getCarProviders = async (req, res, next) => {
  try {
    let query;

    const reqQuery = { ...req.query };

    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    query = CarProvider.find(JSON.parse(queryStr)).populate('appointments');

    // select fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await CarProvider.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const providers = await query;

    // pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: providers.length,
      pagination,
      data: providers
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};


// @desc  Get single car provider
// @route GET /api/v1/carproviders/:id
// @access Public
exports.getCarProvider = async (req, res, next) => {
  try {
    const provider = await CarProvider.findById(req.params.id);

    if (!provider) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: provider
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};


// @desc  Create car provider
// @route POST /api/v1/carproviders
// @access Private/Admin
exports.createCarProvider = async (req, res, next) => {
  try {
    const provider = await CarProvider.create(req.body);
    res.status(201).json({ success: true, data: provider });
  } catch (err) {
    next(err);
  }
};


// @desc  Update car provider
// @route PUT /api/v1/carproviders/:id
// @access Private/Admin
exports.updateCarProvider = async (req, res, next) => {
  try {
    const provider = await CarProvider.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!provider) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: provider
    });
  } catch (err) {
    next(err);
  }
};


// @desc  Delete car provider
// @route DELETE /api/v1/carproviders/:id
// @access Private/Admin
exports.deleteCarProvider = async (req, res, next) => {
  try {
    const provider = await CarProvider.findById(req.params.id);

    if (!provider) {
      return res.status(400).json({
        success: false,
        message: `CarProvider not found with id of ${req.params.id}`
      });
    }

    await Appointment.deleteMany({ carProvider: req.params.id });
    await CarProvider.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};