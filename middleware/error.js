const errorHandler = (err, req, res, next) => {
  console.log('this is from error handler', err.stack);
  res
    .status(err.statusCode || 500)
    .json({ success: false, error: err.message || 'Server Error' });
};

module.exports = errorHandler;
