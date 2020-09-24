const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const connectDB = require('./config/dbConfig');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Initial server setup
const app = express();

// Connect to database
connectDB();

// Middleware methods
// NOTE these first two middleware methods are examples of a custom built logger and a third party logger; they perform the same job.
if (process.env.NODE_ENV === 'development') {
  app.use(logger);
  app.use(morgan('dev'));
}

// Routes
const bootcamps = require('./routes/bootcamps');
// Mounting the routes
app.use('/api/v1/bootcamps', bootcamps);

// Starting up server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err}`);
  // close server and exit process
  server.close(() => process.exit(1));
});
