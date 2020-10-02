const express = require('express');
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

const advancedResults = require('../middleware/advancedResults');
const Course = require('../models/Course');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(createCourse);
router.route('/:id').get(getCourseById).put(updateCourse).delete(deleteCourse);

module.exports = router;
