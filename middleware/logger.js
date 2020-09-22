// Log a message to the console
const logger = (req, res, next) => {
  console.log('Middleware is working');
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  // NOTE if you wanted to you can set certain properties of the 'req' itself
  // For example, you could go like -> req.hello = 'Hello World'
  // Then, in a method you could -> console.log(req.hello)
  // And the output will be 'Hello World'
  // This will become valuable if you need your server to set any 'req' or 'res' values before sending them to the client
  next();
};

module.exports = logger;
