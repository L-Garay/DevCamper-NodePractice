const nodeGeocoder = require('node-geocoder');

var options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

// @ts-ignore
const geocoder = nodeGeocoder(options);

module.exports = geocoder;
