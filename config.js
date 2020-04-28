module.exports.PORT = process.env.PORT || 3000;
module.exports.CONNECTION_ADDRESS = process.env.CONNECTION_ADDRESS || 'mongodb://localhost:27017/vespuccidb';
module.exports.RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};