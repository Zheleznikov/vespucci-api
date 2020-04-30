const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    expires: '7d',
    default: Date.now,
  },
});

module.exports = mongoose.model('token', tokenSchema);