/**
 * Error Handler Middleware
 */

const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ title: 'Error', status: status, message: message });
};

module.exports = errorHandler;
