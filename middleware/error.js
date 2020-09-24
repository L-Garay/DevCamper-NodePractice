const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error (missing fields)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    // since there could be multiple missing fields/validation errors which have multiple key:value pairs, we can't assign all of them to one object.  Therefore we have to extract just the error messages. To do this we have to take just the values of all the errors..and then map over all the values and grab just the messages.
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || 'Server Error' });
};

module.exports = errorHandler;
