// Application configuration

module.exports = {
  appName: 'Dogs CRUD App',
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  debug: process.env.NODE_ENV !== 'production'
};
