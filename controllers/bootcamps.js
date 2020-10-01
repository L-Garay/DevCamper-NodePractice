const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

// GET all bootcamps FROM /api/v1/bootcamps PUBLIC
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // copy req.query
  const reqQuery = { ...req.query };
  // fields to exclude
  const removeFields = ['select', 'sort', 'limit', 'page'];
  // loop over removeFields and delete items from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  // create query string
  let queryStr = JSON.stringify(reqQuery);
  // create operators for MongoDB
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = Bootcamp.find(JSON.parse(queryStr)).populate({
    path: 'courses',
    select: 'title',
  });
  // select certain fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  // Sort certain fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  // Adding pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  // Pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});
// GET single bootcamp FROM /api/v1/bootcamps/:id PUBLIC
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
// POST new bootcamp FROM /api/v1/bootcamps PRIVATE
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});
// PUT edit a bootcamp FROM /api/v1/bootcamps/:id PRIVATE
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});
// DELETE single bootcamp FROM /api/v1/bootcamps/:id PRIVATE
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, msg: 'Successfully deleted bootcamp' });
});

// GET bootcamps within radius FROM /api/v1/bootcamps/radius/:zipcode/:distance PRIVATE
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // Get lat/long from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  // Calc radius using radians, divide distance by radius of earth; Earth's radius is 3963mi
  const radius = distance / 3963;
  // Find the bootcamps
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
