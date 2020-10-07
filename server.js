const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const morgan = require('morgan');
const connectDB = require('./config/dbConfig');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load env variables
dotenv.config({ path: './config/config.env' });

// Initial server setup
const app = express();
// Connect to database
connectDB();

// Client req.body parser
app.use(express.json());

// Middleware methods
// NOTE these first two middleware methods are examples of a custom built logger and a third party logger; they perform the same job.
if (process.env.NODE_ENV === 'development') {
  app.use(logger);
  app.use(morgan('dev'));
}

// Cookie parser
app.use(cookieParser());

// File uploading
app.use(fileupload());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const admins = require('./routes/admins');
const reviews = require('./routes/reviews');
// Mounting the routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/admins', admins);
app.use('/api/v1/reviews', reviews);

// Middleware methods
app.use(errorHandler);

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
