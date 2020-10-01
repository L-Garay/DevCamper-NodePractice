const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// GET all courses FROM /api/v1/courses PUBLIC
// Get all courses by bootcampId from /api/v1/bootcamps/:bootcampid/courses PUBLIC
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// GET course by id FROM /api/v1/courses/:id PUBLIC
exports.getCourseById = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// POST course  FROM /api/v1/bootcamps/:bootcampId/courses PRIVATE
exports.createCourse = asyncHandler(async (req, res, next) => {
  // Check to see if the bootcamp exists
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }
  // NOTE this is how we are setting the 'bootcamp' property on the Course object, since it needs to be an ObjectId of a bootcamp
  req.body.bootcamp = req.params.bootcampId;
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// PUT course  FROM /api/v1/course/:id PRIVATE
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// Delete course  FROM /api/v1/course/:id PRIVATE
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
